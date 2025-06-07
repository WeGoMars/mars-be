import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsString, Max } from 'class-validator';

export enum TradeType {
  Buy = 'buy',
  Sell = 'sell',
}

export class TradeStockDto {
  @IsString()
  symbol: string;

  // @IsEnum(TradeType,{
  //   message: `tradeType must be one of: ${Object.values(TradeType).join(', ')}`,
  // })
  // tradeType: TradeType

  @Type(() => Number)
  @IsNumber()
  @Max(1000000, { message: 'quantity must be 1000000 or less' })
  quantity: number;

  @Type(() => Number)
  @IsNumber()
  price: number;
}
