import { BaseResponseDto } from "src/common/dtos/base-response.dto";

export class SimpleStock {
    symbol: string;
    name: string;
    currentPrice: number;
    priceDelta: number;

    constructor(raw: {
        stock_symbol: string;
        stock_name: string;
        dailyClose: number;
        hourlyClose: number | null;
    }) {
        this.symbol = raw.stock_symbol;
        this.name = raw.stock_name;

        const daily = raw.dailyClose;
        const hourly = raw.hourlyClose;

        this.currentPrice = hourly ?? daily;
        this.priceDelta = hourly !== null ? hourly - daily : 0;
    }
}
