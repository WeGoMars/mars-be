import { Module } from '@nestjs/common';
import { StockController } from './stock.controller';
import { StockService } from './stock.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stock } from './entities/stock.entity';
import { StockOhlcv } from './entities/stock-ohlcv.entity';
import { StockOhlcvToday } from './entities/stock-ohlcv-today.entity';
import { StockFinancials } from './entities/stock-financial.entity';
import { SectorPerformance } from './entities/stock-sector-performance.entity';
import { StockMarket } from './entities/stock-market.entity';
import { StockLatestPriceView } from './entities/stock-latest-price.view';

@Module({
  imports:[TypeOrmModule.forFeature([
    Stock,
    StockOhlcv,
    StockOhlcvToday,
    StockFinancials,
    SectorPerformance,
    StockMarket,
    StockLatestPriceView,
  ])],
  controllers: [StockController],
  providers: [StockService]
})
export class StockModule {}
