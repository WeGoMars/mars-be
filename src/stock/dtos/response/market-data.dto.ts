export class MarketDataDto {
  snp500_returns: Record<string, number>; // '1m', '2m', ..., '12m'
  vix: number[]; // 최근 N일치
  fedfunds_average: Record<string, number>; // '2025-05': 5.25 ...

  constructor(partial:Partial<MarketDataDto>){
    Object.assign(this,partial);
  }
}