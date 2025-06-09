import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trade, TradeType } from './entities/trade.entity';
import { UserDto } from 'src/users/dtos/response/user.dto';
import { TradeStockDto } from './dtos/request/trade-stock.dto';
import { StockService } from 'src/stock/stock.service';
import { WalletService } from 'src/wallet/wallet.service';
import { TradeResultDto } from './dtos/response/trade-result.dto';

@Injectable()
export class TradeService {
  //CONSTRUCTOR!!
  constructor(
    private stockService: StockService,
    private walletService: WalletService,
    @InjectRepository(Trade) private tradeRepo: Repository<Trade>,
  ) {}

  //BUY!!
  async buyStock(user: UserDto, dto: TradeStockDto) {
    const currentStock = await this.stockService.getStockWithPrice(dto.symbol);

    if (!currentStock) {
      throw new NotFoundException(`Stock ${dto.symbol} not found`);
    }

    const currentPrice = currentStock?.hourly_close;
    if (currentPrice !== dto.price) {
      throw new BadRequestException(
        'the stock price changed. please request again with new price',
      );
    }

    const priceTotal = dto.price * dto.quantity;
    const wallet = await this.walletService.getWallet(user);
    if (wallet.cyberDollar < priceTotal) {
      throw new BadRequestException('not enough money in your wallet!');
    }

    const trade = this.tradeRepo.create({
      user: { id: user.id },
      stock: { id: currentStock.stock_id },
      type: TradeType.BUY,
      quantity: dto.quantity,
      price: dto.price,
    });

    const saved = await this.tradeRepo.save(trade);
    const savedWallet = await this.walletService.addSeedMoney(
      user,
      -priceTotal,
    );

    const myShare = await this.howManyIGot(user, currentStock.stock_id);

    const data = {
      symbol: dto.symbol,
      price: dto.price,
      balance: savedWallet.cyberDollar,
      share: myShare,
      tradedAt: saved.createdAt,
    };
    return new TradeResultDto(data);
  }

  //SELL!!
  async sellStock(user: UserDto, dto: TradeStockDto) {
    const currentStock = await this.stockService.getStockWithPrice(dto.symbol);

    if (!currentStock) {
      throw new NotFoundException(`Stock ${dto.symbol} not found`);
    }

    const currentPrice = currentStock?.hourly_close;
    if (currentPrice !== dto.price) {
      throw new BadRequestException(
        'the stock price changed. please request again with new price',
      );
    }

    const stockIGot = await this.howManyIGot(user, currentStock.stock_id);
    if (stockIGot < dto.quantity) {
      throw new BadRequestException(`You have only ${stockIGot} share`);
    }

    const trade = this.tradeRepo.create({
      user: { id: user.id },
      stock: { id: currentStock.stock_id },
      type: TradeType.SELL,
      quantity: dto.quantity,
      price: dto.price,
    });
    const priceTotal = dto.quantity * dto.price;
    const saved = await this.tradeRepo.save(trade);
    const savedWallet = await this.walletService.depositToWallet(
      user,
      +priceTotal,
    );

    const data = {
      symbol: dto.symbol,
      price: dto.price,
      balance: savedWallet.cyberDollar,
      share: stockIGot - dto.quantity,
      tradedAt: saved.createdAt,
    };
    return new TradeResultDto(data);
  }

  ///Common Function
  async howManyIGot(user: UserDto, theStockId: number) {
    const tradeResults = await this.tradeRepo
      .createQueryBuilder('trade')
      .select(
        'SUM(CASE WHEN trade.type = :buy THEN trade.quantity ELSE -trade.quantity END)',
        'totalQuantity',
      )
      .where('trade.userId = :userId', { userId: user.id })
      .andWhere('trade.stockId = :stockId', { stockId: theStockId })
      .setParameters({ buy: TradeType.BUY })
      .getRawOne();
    return Number(tradeResults.totalQuantity ?? 0);
  }

  
}
