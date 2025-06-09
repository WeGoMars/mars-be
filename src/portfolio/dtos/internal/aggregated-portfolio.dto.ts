import { Stock } from 'src/stock/entities/stock.entity';

export class AggregatedPortfolioDto {
  stock: Stock;
  quantity: number;
  avgBuyPrice: number;
  currentPrice: number;
  evalAmount: number;
  evalGain: number;
  returnRate: number;

  constructor(partial: Partial<AggregatedPortfolioDto>) {
    Object.assign(this, partial);
  }
}
