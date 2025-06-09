import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StockLatestPriceView } from 'src/stock/entities/stock-latest-price.view';
import { Trade, TradeType } from 'src/trade/entities/trade.entity';
import { UserDto } from 'src/users/dtos/response/user.dto';
import { In, Repository } from 'typeorm';
import { LikeDto } from './dtos/request/like.dto';
import { Like } from './entities/like.entity';
import { LikeResponse } from './dtos/response/like-response.dto';
import { LikeStock } from './dtos/response/like-stock.dto';
import { Stock } from 'src/stock/entities/stock.entity';
import { MyStock } from './dtos/response/my-stock.dto';
import { AggregatedPortfolioDto } from './dtos/internal/aggregated-portfolio.dto';
import { Wallet } from 'src/wallet/entities/wallet.entity';
import { UserPortfolioDto } from './dtos/response/user-portfolio.dto';
import { StockPortfolioDto } from './dtos/response/stock-portfolio.dto';

@Injectable()
export class PortfolioService {
  constructor(
    @InjectRepository(StockLatestPriceView)
    private stockViewRepo: Repository<StockLatestPriceView>,
    @InjectRepository(Trade) private tradeRepo: Repository<Trade>,
    @InjectRepository(Like) private likeRepo: Repository<Like>,
    @InjectRepository(Wallet) private walletRepo: Repository<Wallet>,
  ) {}

  async createLike(user: UserDto, dto: LikeDto) {
    const stock = await this.stockViewRepo.findOne({
      where: { symbol: dto.symbol },
    });
    if (!stock) {
      throw new NotFoundException('no such symbol');
    }

    const like = this.likeRepo.create({
      user: { id: user.id },
      stock: { id: stock.stock_id },
    });
    try {
      const saved = await this.likeRepo.save(like);
      const data = {
        symbol: dto.symbol,
        createdAt: saved.createdAt,
      };
      return new LikeResponse(data);
    } catch (e) {
      if (e.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException('you already liked this stock!');
      }
      throw new BadRequestException('알 수 없는 에러입니다.');
    }
  }

  async deleteLike(user: UserDto, dto: LikeDto) {
    const stock = await this.stockViewRepo.findOne({
      where: { symbol: dto.symbol },
    });
    if (!stock) {
      throw new NotFoundException('no such symbol');
    }

    const like = await this.likeRepo.findOne({
      where: {
        user: { id: user.id },
        stock: { id: stock.stock_id },
      },
    });
    if (!like) {
      throw new NotFoundException('no such like');
    }
    const result = await this.likeRepo.remove(like);
    return result ? true : false;
  }

  async getMyLikes(user: UserDto) {
    const likes = await this.likeRepo
      .createQueryBuilder('like')
      .innerJoinAndMapOne(
        'like.stockView',
        StockLatestPriceView,
        'view',
        'view.stock_id = like.stock.id',
      )
      .innerJoinAndSelect('like.stock', 'stock')
      .where('like.user.id = :userId', { userId: user.id })
      .orderBy('like.createdAt', 'DESC')
      .getMany();

    const results = likes.map((like) => {
      const view = like.stockView;
      if (!view) {
        return null;
      }
      const data = {
        symbol: like.stockView!.symbol,
        name: like.stockView!.name,
        sector: like.stock.sector,
        industry: like.stock.industry,
        currentPrice: like.stockView!.hourly_close,
        priceDelta: like.stockView!.hourly_close - like.stockView!.daily_close,
      };
      return new LikeStock(data);
    });
    return results;
  }

  async getMyStockes(user: UserDto) {
    const trades = await this.tradeRepo.find({
      where: { user: { id: user.id } },
      relations: ['stock'],
    });
    const stockQuantityMap = new Map<
      number,
      { stock: Stock; netQuantity: number }
    >();

    for (const trade of trades) {
      const id = trade.stock.id;

      const prev = stockQuantityMap.get(id) || {
        stock: trade.stock,
        netQuantity: 0,
      };

      const delta =
        trade.type === TradeType.BUY ? trade.quantity : -trade.quantity;

      stockQuantityMap.set(id, {
        stock: trade.stock,
        netQuantity: prev.netQuantity + delta,
      });
    }

    const heldStockIds = Array.from(stockQuantityMap.entries())
      .filter(([_, v]) => v.netQuantity > 0)
      .map(([id]) => id);

    const stockViews = await this.stockViewRepo.find({
      where: { stock_id: In(heldStockIds) },
    });
    return stockViews.map(
      (view) =>
        new MyStock({
          symbol: view.symbol,
          name: view.name,
          sector: view['sector'],
          industry: view['industry'],
          currentPrice: view.hourly_close,
          priceDelta: view.hourly_close - view.daily_close,
        }),
    );
  }

  async aggregateUserPortfolio(
    user: UserDto,
  ): Promise<AggregatedPortfolioDto[]> {
    const trades = await this.tradeRepo.find({
      where: { user: { id: user.id } },
      relations: ['stock'],
    });

    const grouped = new Map<
      number,
      {
        stock: Stock;
        buyQuantity: number;
        buyCost: number;
        sellQuantity: number;
      }
    >();

    for (const trade of trades) {
      const id = trade.stock.id;
      const g = grouped.get(id) ?? {
        stock: trade.stock,
        buyQuantity: 0,
        buyCost: 0,
        sellQuantity: 0,
      };

      if (trade.type === TradeType.BUY) {
        g.buyQuantity += trade.quantity;
        g.buyCost += trade.price * trade.quantity;
      } else {
        g.sellQuantity += trade.quantity;
      }

      grouped.set(id, g);
    }

    const held = Array.from(grouped.values()).filter(
      (g) => g.buyQuantity > g.sellQuantity,
    );
    const stockIds = held.map((g) => g.stock.id);

    const priceViews = await this.stockViewRepo.find({
      where: { stock_id: In(stockIds) },
    });
    const priceMap = new Map(priceViews.map((v) => [v.stock_id, v]));

    return held.map((g) => {
      const quantity = g.buyQuantity - g.sellQuantity;
      const avgBuyPrice = g.buyCost / g.buyQuantity;
      const currentPrice = priceMap.get(g.stock.id)?.hourly_close ?? 0;
      const evalAmount = quantity * currentPrice;
      const evalGain = evalAmount - quantity * avgBuyPrice;
      const returnRate =
        quantity * avgBuyPrice ? evalGain / (quantity * avgBuyPrice) : 0;

      return new AggregatedPortfolioDto({
        stock: g.stock,
        quantity,
        avgBuyPrice,
        currentPrice,
        evalAmount,
        evalGain,
        returnRate,
      });
    });
  }

  async getMySimplePF(user: UserDto) {
    const items = await this.aggregateUserPortfolio(user);

    const totalEvalAmount = items.reduce((sum, p) => sum + p.evalAmount, 0);
    const totalInvested = items.reduce(
      (sum, p) => sum + p.avgBuyPrice * p.quantity,
      0,
    );
    const evalGain = totalEvalAmount - totalInvested;
    const returnRate = totalInvested ? evalGain / totalInvested : 0;

    const wallet = await this.walletRepo.findOneOrFail({
      where: { user: { id: user.id } },
    });

    return new UserPortfolioDto({
      totalAsset: totalEvalAmount + wallet.cyberDollar,
      investedAmount: totalInvested,
      evalGain,
      returnRate,
      totalSeed: wallet.cyberDollarAccum,
      investRatio: totalInvested / (wallet.cyberDollarAccum || 1),
      cash: wallet.cyberDollar,
    });
  }

  async getMyStockPortfolio(user: UserDto) {
  const items = await this.aggregateUserPortfolio(user);

  return items.map((item) => new StockPortfolioDto({
    symbol: item.stock.symbol,
    name: item.stock.name,
    quantity: item.quantity,
    avgBuyPrice: item.avgBuyPrice,
    evalAmount: item.evalAmount,
    evalGain: item.evalGain,
    returnRate: item.returnRate,
  }));
}
}
