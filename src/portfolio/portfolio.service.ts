import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StockLatestPriceView } from 'src/stock/entities/stock-latest-price.view';
import { Trade } from 'src/trade/entities/trade.entity';
import { UserDto } from 'src/users/dtos/response/user.dto';
import { Repository } from 'typeorm';
import { LikeDto } from './dtos/request/like.dto';
import { Like } from './entities/like.entity';
import { LikeResponse } from './dtos/response/like-response.dto';
import { LikeStock } from './dtos/response/like-stock.dto';

@Injectable()
export class PortfolioService {
  constructor(
    @InjectRepository(StockLatestPriceView)
    private stockViewRepo: Repository<StockLatestPriceView>,
    @InjectRepository(Trade) private tradeRepo: Repository<Trade>,
    @InjectRepository(Like) private likeRepo: Repository<Like>,
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
        'view.stock_id = like.stock.id'
      )
      .innerJoinAndSelect('like.stock','stock')
      .where('like.user.id = :userId',{userId :user.id})
      .orderBy('like.createdAt','DESC')
      .getMany();

      const results = likes.map((like)=>{
        const view = like.stockView;
        if(!view){
          return null;
        }
        const data={
          symbol:like.stockView!.symbol,
          name:like.stockView!.name,
          sector:like.stock.sector,
          industry:like.stock.industry,
          currentPrice:like.stockView!.hourly_close,
          priceDelta: (like.stockView!.hourly_close) - (like.stockView!.daily_close)
        }
        return new LikeStock(data);
      })
      return results;
  }
}
