import { IsString, IsEnum, Max, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchStocksDto {
  @IsString()
  query: string;

  @Type(() => Number)
  @IsNumber()
  @Max(20, { message: 'limit must be 20 or less' })
  limit: number
}
