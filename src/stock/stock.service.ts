import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, ILike, In, Repository } from 'typeorm';
import { Stock } from './entities/stock.entity';
import { StockOhlcv } from './entities/stock-ohlcv.entity';
import { ChartRequestDto, Interval } from './dtos/request/chart-request.dto';
import { StockOhlcvToday } from './entities/stock-ohlcv-today.entity';
import { ChartPointDto } from './dtos/response/chart-point.dto';
import { StockFinancials } from './entities/stock-financial.entity';
import { DetailedStockResponseDto } from './dtos/response/detailed-stock.dto';
import { NotFoundException } from '@nestjs/common';
import { SearchStocksDto } from './dtos/request/search-stocks.dto';
import { SearchedStock } from './dtos/response/searched-stock.dto';
import { ListStocksDto } from './dtos/request/list-stocks.dto';
import { StockLatestPriceView } from './entities/stock-latest-price.view';
import { MarketMetricType, StockMarket } from './entities/stock-market.entity';
import { MarketDataDto } from './dtos/response/market-data.dto';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(Stock) private stockRepo: Repository<Stock>,
    @InjectRepository(StockOhlcv)
    private stockOhlcvRepo: Repository<StockOhlcv>,
    @InjectRepository(StockOhlcvToday)
    private stockOhlcvTodayRepo: Repository<StockOhlcvToday>,
    @InjectRepository(StockFinancials)
    private financeRepo: Repository<StockFinancials>,
    @InjectRepository(StockLatestPriceView)
    private stockViewRepo: Repository<StockLatestPriceView>,
    @InjectRepository(StockMarket)
    private marketRepo: Repository<StockMarket>,
  ) {}

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

  getStockWithPrice(
    symbolString: string,
  ): Promise<StockLatestPriceView | null> {
    return this.stockViewRepo.findOne({
      where: { symbol: symbolString },
    });
  }

  async getChart(query: ChartRequestDto) {
    await this.assertSymbolExists(query.symbol);

    const queryBuilder =
      query.interval === Interval.OneHour
        ? this.stockOhlcvTodayRepo.createQueryBuilder('ohlcv')
        : this.stockOhlcvRepo.createQueryBuilder('ohlcv');

    const rawData = await queryBuilder
      .innerJoin('ohlcv.stock', 'stock')
      .where('stock.symbol = :symbol', { symbol: query.symbol })
      .andWhere('ohlcv.interval = :interval', { interval: query.interval })
      .orderBy('ohlcv.timestamp', 'DESC')
      .limit(query.limit)
      .getMany();

    return rawData.map((row) => new ChartPointDto(row));
  }

  async getDetailedStock(symbolParam: string) {
    await this.assertSymbolExists(symbolParam);

    const qb = this.stockViewRepo.createQueryBuilder('view');

    qb.leftJoin(
      (subQ) =>
        subQ
          .select('f.stock_id', 'stock_id')
          .addSelect('MAX(f.targetDate)', 'latestTargetDate')
          .from('stock_financials', 'f')
          .groupBy('f.stock_id'),
      'latest_fin',
      'latest_fin.stock_id = view.stock_id',
    );

    qb.leftJoin(
      'stock_financials',
      'f',
      'f.stock_id = latest_fin.stock_id AND f.targetDate = latest_fin.latestTargetDate',
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
    return new DetailedStockResponseDto(result);
  }

  async searchStocksByNameAndSymbol(
    dto: SearchStocksDto,
  ): Promise<SearchedStock[]> {
    const qb = this.stockViewRepo.createQueryBuilder('stockview');

    if (dto.query && dto.query.trim() !== '') {
      qb.where(
        new Brackets((qb) => {
          qb.where('LOWER(stockview.symbol) LIKE LOWER(:query)', {
            query: `%${dto.query}%`,
          }).orWhere('LOWER(stockview.name) LIKE LOWER(:query)', {
            query: `%${dto.query}%`,
          });
        }),
      );
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
      'stockview.hourly_volume AS hourlyVolume',
    ]);

    const rawData = await qb.getRawMany();
    // console.log(rawData);
    return rawData.map((row) => new SearchedStock(row));
  }

  async listHotStocks(query: ListStocksDto): Promise<SearchedStock[]> {
    const qb = this.stockViewRepo.createQueryBuilder('stockview');

    qb.select([
      'stockview.stock_id AS stock_id',
      'stockview.symbol AS symbol',
      'stockview.name AS name',
      'stockview.sector AS sector',
      'stockview.industry AS industry',
      'stockview.daily_close AS dailyClose',
      'stockview.hourly_close AS hourlyClose',
      'stockview.hourly_volume AS hourlyVolume',
    ]);

    qb.orderBy('stockview.hourly_volume', 'DESC');

    const limit = query.limit ?? 20;
    qb.take(limit);

    const rawData = await qb.getRawMany();
    return rawData.map((row) => new SearchedStock(row));
  }

  async getMarketData(): Promise<MarketDataDto> {
    // 1. S&P500 1m~12m 수익률 가져오기
    const snpKeys = [
      MarketMetricType.SNP500_1M_RETURN,
      MarketMetricType.SNP500_2M_RETURN,
      MarketMetricType.SNP500_3M_RETURN,
      MarketMetricType.SNP500_4M_RETURN,
      MarketMetricType.SNP500_5M_RETURN,
      MarketMetricType.SNP500_6M_RETURN,
      MarketMetricType.SNP500_7M_RETURN,
      MarketMetricType.SNP500_8M_RETURN,
      MarketMetricType.SNP500_9M_RETURN,
      MarketMetricType.SNP500_10M_RETURN,
      MarketMetricType.SNP500_11M_RETURN,
      MarketMetricType.SNP500_12M_RETURN,
    ];

    const snpItems = await this.marketRepo.find({
      where: { name: In(snpKeys) },
      order: { name: 'ASC', timestamp: 'DESC' },
    });

    const latestSnpByType = new Map<string, StockMarket>();
    for (const item of snpItems) {
      if (!latestSnpByType.has(item.name)) {
        latestSnpByType.set(item.name, item); // 가장 최신만 선택
      }
    }

    const snp500_returns = Object.fromEntries(
      [...latestSnpByType.entries()].map(([name, item]) => {
        const label = name
          .replace('SNP500_', '')
          .replace('_RETURN', '')
          .toLowerCase(); // e.g., '1m'
        return [label, item.value];
      }),
    );

    // 2. VIX 최근 15개
    const vixItems = await this.marketRepo.find({
      where: { name: MarketMetricType.VIX },
      order: { timestamp: 'DESC' },
      take: 15,
    });

    const vix = vixItems
      .sort((a, b) => a.timestamp.localeCompare(b.timestamp))
      .map((item) => item.value);

    // 3. FEDFUNDS 평균 최근 10개
    const fedItems = await this.marketRepo.find({
      where: { name: MarketMetricType.FEDFUNDS_AVERAGE },
      order: { timestamp: 'DESC' },
      take: 10,
    });

    const fedfunds_average = Object.fromEntries(
      fedItems
        .sort((a, b) => a.timestamp.localeCompare(b.timestamp))
        .map((item) => [item.timestamp.slice(0, 7), item.value]), // 'YYYY-MM'
    );

    return {
      snp500_returns,
      vix,
      fedfunds_average,
    };
  }
}
