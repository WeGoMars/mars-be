import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, ILike, Repository } from 'typeorm';
import { Stock } from './entities/stock.entity';
import { StockOhlcv } from './entities/stock-ohlcv.entity';
import { ChartRequestDto, Interval } from './dtos/request/chart-request.dto';
import { StockOhlcvToday } from './entities/stock-ohlcv-today.entity';
import { ChartPointDto } from './dtos/response/chart-point.dto';
import { StockFinancials } from './entities/stock-financial.entity';
import { DetailedStockResponseDto } from './dtos/response/detailed-stock.dto';
import { NotFoundException } from '@nestjs/common';
import { SearchStocksDto } from './dtos/request/search-stocks.dto';
import { SearchedStock } from './dtos/response/search-stock.dto';
import { ListStocksDto } from './dtos/request/list-stocks.dto';
import { StockLatestPriceView } from './entities/stock-latest-price.view';

@Injectable()
export class StockService {
    constructor(
        @InjectRepository(Stock) private stockRepo: Repository<Stock>,
        @InjectRepository(StockOhlcv) private stockOhlcvRepo: Repository<StockOhlcv>,
        @InjectRepository(StockOhlcvToday) private stockOhlcvTodayRepo: Repository<StockOhlcvToday>,
        @InjectRepository(StockFinancials) private financeRepo: Repository<StockFinancials>,
        @InjectRepository(StockLatestPriceView) private stockViewRepo: Repository<StockLatestPriceView>,
    ) { }

    async assertSymbolExists(symbol: string): Promise<void> {
        const exists = await this.stockRepo.exist({ where: { symbol } });
        if (!exists) {
            throw new NotFoundException(`No Such Symbol : (${symbol})`);
        }
    }

    getSymbols() {
        return this.stockRepo.find({
            select: ['id', 'symbol'],
        });
    }

    async getChart(query: ChartRequestDto) {

        await this.assertSymbolExists(query.symbol);

        const queryBuilder = (query.interval === Interval.OneHour)
            ? this.stockOhlcvTodayRepo.createQueryBuilder('ohlcv')
            : this.stockOhlcvRepo.createQueryBuilder('ohlcv');

        const rawData = await queryBuilder
            .innerJoin('ohlcv.stock', 'stock')
            .where('stock.symbol = :symbol', { symbol: query.symbol })
            .andWhere('ohlcv.interval = :interval', { interval: query.interval })
            .orderBy('ohlcv.timestamp', 'DESC')
            .limit(query.limit)
            .getMany();

        return rawData.map(row => new ChartPointDto(row));
    }

    async getDetailedStock(symbolParam: string) {
        await this.assertSymbolExists(symbolParam);

        const qb = this.stockViewRepo.createQueryBuilder('view');

        qb.leftJoin(
            subQ => subQ
                .select('f.stock_id', 'stock_id')
                .addSelect('MAX(f.targetDate)', 'latestTargetDate')
                .from('stock_financials', 'f')
                .groupBy('f.stock_id'),
            'latest_fin',
            'latest_fin.stock_id = view.stock_id'
        );

        qb.leftJoin(
            'stock_financials',
            'f',
            'f.stock_id = latest_fin.stock_id AND f.targetDate = latest_fin.latestTargetDate'
        );

        qb.select([
            'view.stock_id AS stock_id',
            'view.symbol AS symbol',
            'view.name AS name',
            'view.sector AS sector',
            'view.industry AS industry',
            'view.daily_close AS dailyClose',
            'view.hourly_close AS hourlyClose',
            'view.hourly_volume AS hourlyVolume',
            'f.roe',
            'f.bps',
            'f.eps',
            'f.beta',
            'f.marketCap',
            'f.dividendYield',
            'f.currentRatio',
            'f.debtRatio',
        ]);

        qb.where('view.symbol = :symbol', { symbol: symbolParam });

        const result = await qb.getRawOne();
        console.log(result);
        return new DetailedStockResponseDto(result);
    }

    async searchStocksByNameAndSymbol(dto: SearchStocksDto): Promise<SearchedStock[]> {
        const qb = this.stockViewRepo.createQueryBuilder('stockview');

        if (dto.query && dto.query.trim() !== '') {
            qb.where(new Brackets(qb => {
                qb.where('LOWER(stockview.symbol) LIKE LOWER(:query)', { query: `%${dto.query}%` })
                    .orWhere('LOWER(stockview.name) LIKE LOWER(:query)', { query: `%${dto.query}%` });
            }));
        }

        if (!dto.limit) {
            throw new BadRequestException('limit required');
        }
        qb.take(dto.limit);

        qb.select([
            'stockview.stock_id AS stock_id',
            'stockview.symbol AS symbol',
            'stockview.name AS name',
            'stockview.sector AS sector',
            'stockview.industry AS industry',
            'stockview.daily_close AS dailyClose',
            'stockview.hourly_close AS hourlyClose',
        ]);

        const rawData = await qb.getRawMany();
        // console.log(rawData);
        return rawData.map(row => new SearchedStock(row));
    }


    async listHotStocks(query: ListStocksDto) {

    }

}
