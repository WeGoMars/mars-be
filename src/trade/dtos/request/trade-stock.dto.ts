import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsString, Max } from 'class-validator';

export class TradeStockDto {
  @IsString()
  symbol: string;

  @Type(() => Number)
  @IsNumber()
  @Max(1000000, { message: 'quantity must be 1000000 or less' })
  quantity: number;

  @Type(() => Number)
  @IsNumber()
  price: number;
}
