import { Module } from '@nestjs/common';
import { StockController } from './stock.controller';
import { StockService } from './stock.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stock } from './entities/stock.entity';
import { StockOhlcv } from './entities/stock-ohlcv.entity';
import { StockOhlcvToday } from './entities/stock-ohlcv-today.entity';

@Module({
  imports:[TypeOrmModule.forFeature([
    Stock,
    StockOhlcv,
    StockOhlcvToday
  ])],
  controllers: [StockController],
  providers: [StockService]
})
export class StockModule {}
