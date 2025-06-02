import { StockOhlcv } from "src/stock/entities/stock-ohlcv.entity";
import { StockOhlcvToday } from "src/stock/entities/stock-ohlcv-today.entity";

export class ChartPointDto {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;

  constructor(entity: StockOhlcv | StockOhlcvToday) {
    this.timestamp = entity.timestamp;
    this.open = entity.open;
    this.high = entity.high;
    this.low = entity.low;
    this.close = entity.close;
    this.volume = entity.volume;
  }
}
