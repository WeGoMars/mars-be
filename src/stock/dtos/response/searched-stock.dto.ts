

export class SearchedStock {
  symbol: string;
  name: string;
  sector: string;
  industry: string;
  currentPrice: number;
  priceDelta: number;
  hourlyVolume: number | null;

  constructor(raw: {
    symbol: string;
    name: string;
    sector: string;
    industry: string;
    dailyClose: number;
    hourlyClose: number | null;
    hourlyVolume?: number | null;
  }) {
    this.symbol = raw.symbol;
    this.name = raw.name;
    this.sector = raw.sector;
    this.industry = raw.industry;

    const daily = raw.dailyClose;
    const hourly = raw.hourlyClose;

    this.currentPrice = hourly ?? daily;
    this.priceDelta = hourly !== null ? hourly - daily : 0;
    this.hourlyVolume = raw.hourlyVolume ?? null;
  }
}
