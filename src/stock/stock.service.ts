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

        const qb = this.stockRepo.createQueryBuilder('stock');
        // 📌 최신 financials의 targetDate를 찾는 서브쿼리
        qb.leftJoin(
            subQ => subQ
                .select('f.stock_id', 'stock_id',)
                .addSelect('MAX(f.targetDate)', 'latestTargetDate')
                .from('stock_financials', 'f')
                .groupBy('f.stock_id'),
            'latest_fin',
            'latest_fin.stock_id = stock.id'
        );
        qb.leftJoin(
            'stock_financials',
            'finance',
            'finance.stock_id = latest_fin.stock_id AND finance.targetDate = latest_fin.latestTargetDate'
        );
        // 📌 최신 일봉 OHLCV (interval = '1day')
        qb.leftJoin(
            subQ => subQ
                .select('o.stock_id', 'stock_id')
                .addSelect('MAX(o.timestamp)', 'latestDaily')
                .from('stock_ohlcv', 'o')
                .where("o.interval = '1day'")
                .groupBy('o.stock_id'),
            'latest_ohlcv',
            'latest_ohlcv.stock_id = stock.id'
        );
        qb.leftJoin(
            'stock_ohlcv',
            'ohlcv',
            "ohlcv.stock_id = latest_ohlcv.stock_id AND ohlcv.timestamp = latest_ohlcv.latestDaily AND ohlcv.interval = '1day'"
        );
        // 📌 최신 시간봉 OHLCV (interval = '1h')
        qb.leftJoin(
            subQ => subQ
                .select('ot.stock_id', 'stock_id')
                .addSelect('MAX(ot.timestamp)', 'latestHourly')
                .from('stock_ohlcv_today', 'ot')
                .where("ot.interval = '1h'")
                .groupBy('ot.stock_id'),
            'latest_ohlcv_today',
            'latest_ohlcv_today.stock_id = stock.id'
        );
        qb.leftJoin(
            'stock_ohlcv_today',
            'ohlcv_today',
            "ohlcv_today.stock_id = latest_ohlcv_today.stock_id AND ohlcv_today.timestamp = latest_ohlcv_today.latestHourly AND ohlcv_today.interval = '1h'"
        );
        // 🔎 원하는 데이터만 선택
        qb.select([
            'stock.id',
            'stock.symbol',
            'stock.name',
            'finance.roe',
            'finance.bps',
            'finance.eps',
            'finance.beta',
            'finance.marketCap',
            'finance.dividendYield',
            'finance.currentRatio',
            'finance.debtRatio',
            'finance.sector',
            'finance.industry',
            'ohlcv.close AS dailyClose',
            'ohlcv_today.close AS hourlyClose'
        ]);

        // 🔍 심볼 조건 추가
        qb.where('stock.symbol = :symbol', { symbol: symbolParam });

        const result = await qb.getRawOne();
        // console.log(result)
        return new DetailedStockResponseDto(result);
    }

    async searchStocksByNameAndSymbol(dto: SearchStocksDto): Promise<SearchedStock[]> {
        const qb = this.stockViewRepo.createQueryBuilder('stockview');

        // 🔍 검색 조건
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

        // ✅ 뷰의 컬럼만 select
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
