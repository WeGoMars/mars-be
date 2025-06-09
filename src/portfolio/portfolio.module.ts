import { Module } from '@nestjs/common';
import { PortfolioController } from './portfolio.controller';
import { PortfolioService } from './portfolio.service';
import { Trade } from 'src/trade/entities/trade.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockLatestPriceView } from 'src/stock/entities/stock-latest-price.view';
import { Like } from './entities/like.entity';
import { Wallet } from 'src/wallet/entities/wallet.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Trade, StockLatestPriceView, Like, Wallet]),
  ],
  controllers: [PortfolioController],
  providers: [PortfolioService],
  exports: [PortfolioService],
})
export class PortfolioModule {}
