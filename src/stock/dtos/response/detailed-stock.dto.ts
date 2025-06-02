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
    this.symbol = raw.stock_symbol;
    this.name = raw.stock_name;

    this.roe = raw.finance_roe ?? null;
    this.eps = raw.finance_eps ?? null;
    this.bps = raw.finance_bps ?? null;
    this.beta = raw.finance_beta ?? null;
    this.marketCap = raw.finance_marketCap ?? null;
    this.dividendYield = raw.finance_dividendYield ?? null;
    this.currentRatio = raw.finance_currentRatio ?? null;
    this.debtRatio = raw.finance_debtRatio ?? null;
    this.sector = raw.finance_sector ?? null;
    this.industry = raw.finance_industry ?? null;

    this.lastPrice = raw.dailyClose ?? null;
    this.currentPrice = raw.hourlyClose ?? null;
  }
}
