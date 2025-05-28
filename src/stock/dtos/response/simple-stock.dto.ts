import { BaseResponseDto } from "src/common/dtos/base-response.dto";

export class SimpleStock {
    symbol: string;
    name: string;
    like: boolean;
    currentPrice: number;
    priceDelta:number;
}