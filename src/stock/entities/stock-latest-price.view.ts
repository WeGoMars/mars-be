import { ViewEntity, ViewColumn, PrimaryColumn, DataSource } from 'typeorm';

@ViewEntity({
  name: 'stock_latest_price_view',
  expression: (connection: DataSource) => connection.createQueryBuilder()
    .select('s.id', 'stock_id')
    .addSelect('s.symbol', 'symbol')
    .addSelect('s.name', 'name')
    .addSelect('s.sector', 'sector')
    .addSelect('s.industry', 'industry')
    .addSelect('d.close', 'daily_close')
    .addSelect('h.close', 'hourly_close')
    .addSelect('h.volume', 'hourly_volume')
    .from('stock', 's')
    .leftJoin(
      qb => qb
        .select('o.stock_id', 'stock_id')
        .addSelect('o.close', 'close')
        .from('stock_ohlcv', 'o')
        .innerJoin(
          qb2 => qb2
            .select('stock_id', 'stock_id')
            .addSelect('MAX(timestamp)', 'latest')
            .from('stock_ohlcv', 'o')
            .where("o.interval = '1day'")
            .groupBy('stock_id'),
          'latest_daily',
          'o.stock_id = latest_daily.stock_id AND o.timestamp = latest_daily.latest'
        )
        .where("o.interval = '1day'"),
      'd',
      'd.stock_id = s.id'
    )
    .leftJoin(
      qb => qb
        .select('o2.stock_id', 'stock_id')
        .addSelect('o2.close', 'close')
        .addSelect('o2.volume', 'volume')
        .from('stock_ohlcv_today', 'o2')
        .innerJoin(
          qb2 => qb2
            .select('stock_id', 'stock_id')
            .addSelect('MAX(timestamp)', 'latest')
            .from('stock_ohlcv_today', 'o2')
            .where("o2.interval = '1h'")
            .groupBy('stock_id'),
          'latest_hourly',
          'o2.stock_id = latest_hourly.stock_id AND o2.timestamp = latest_hourly.latest'
        )
        .where("o2.interval = '1h'"),
      'h',
      'h.stock_id = s.id'
    )
})
export class StockLatestPriceView {
  @PrimaryColumn()
  stock_id: number;

  @ViewColumn()
  symbol: string;

  @ViewColumn()
  name: string;

  @ViewColumn()
  daily_close: number;

  @ViewColumn()
  hourly_close: number;
}
