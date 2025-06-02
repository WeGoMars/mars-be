import { IsString, IsEnum, Max, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export enum Interval {
  OneHour = '1h',
  OneDay = '1day',
  OneWeek = '1week',
  OneMonth = '1month'
}

export class ChartRequestDto {
  @IsString()
  symbol: string;

  @IsEnum(Interval, {
    message: `interval must be one of: ${Object.values(Interval).join(', ')}`,
  })
  interval: Interval;

  @Type(() => Number)
  @IsNumber()
  @Max(120, { message: 'limit must be 120 or less' })
  limit: number
}
