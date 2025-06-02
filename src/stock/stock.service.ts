import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stock } from './entities/stock.entity';
import { StockOhlcv } from './entities/stock-ohlcv.entity';
import { ChartRequestDto, Interval } from './dtos/request/chart-request.dto';
import { StockOhlcvToday } from './entities/stock-ohlcv-today.entity';
import { ChartPointDto } from './dtos/response/chart-point.dto';

@Injectable()
export class StockService {
    constructor(
        @InjectRepository(Stock) private stockRepo: Repository<Stock>,
        @InjectRepository(StockOhlcv) private stockOhlcvRepo: Repository<StockOhlcv>,
        @InjectRepository(StockOhlcvToday) private stockOhlcvTodayRepo: Repository<StockOhlcvToday>,
    ) { }

    getSymbols() {
        return this.stockRepo.find({
            select: ['id', 'symbol'],
        });
    }

    async getChart(query: ChartRequestDto) {
        const queryBase = (query.interval === Interval.OneHour)
            ? this.stockOhlcvTodayRepo.createQueryBuilder('ohlcv')
            : this.stockOhlcvRepo.createQueryBuilder('ohlcv');

        const rawData = await queryBase
            .innerJoin('ohlcv.stock', 'stock')
            .where('stock.symbol = :symbol', { symbol: query.symbol })
            .andWhere('ohlcv.interval = :interval', { interval: query.interval })
            .orderBy('ohlcv.timestamp', 'DESC')
            .limit(query.limit)
            .getMany();

        return rawData.map(row => new ChartPointDto(row));
    }
}
