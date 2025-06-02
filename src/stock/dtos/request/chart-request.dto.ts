import { IsString, IsEnum, IsISO8601, IsNumber } from 'class-validator';
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
  limit: number
}
