export class DetailedStockResponseDto {
  stockId: number;
  symbol: string;
  name: string;

  roe: number | null;
  eps: number | null;
  bps: number | null;
  beta: number | null;
  marketCap: number | null;
  dividendYield: number | null;
  currentRatio: number | null;
  debtRatio: number | null;
  sector: string | null;
  industry: string | null;

  lastPrice: number | null;
  currentPrice: number | null;

  constructor(raw: any) {
    this.stockId = raw.stock_id;
    this.symbol = raw.symbol;
    this.name = raw.name;

    this.roe = raw.f_roe ?? null;
    this.eps = raw.f_eps ?? null;
    this.bps = raw.f_bps ?? null;
    this.beta = raw.f_beta ?? null;
    this.marketCap = raw.f_marketCap ?? null;
    this.dividendYield = raw.f_dividendYield ?? null;
    this.currentRatio = raw.f_currentRatio ?? null;
    this.debtRatio = raw.f_debtRatio ?? null;

    this.sector = raw.sector ?? null;
    this.industry = raw.industry ?? null;

    this.lastPrice = raw.dailyClose ?? null;
    this.currentPrice = raw.hourlyClose ?? null;
  }
}
