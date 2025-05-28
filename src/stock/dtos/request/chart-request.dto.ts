import { IsString, IsEnum, IsISO8601 } from 'class-validator';

export enum Interval {
  OneMinute = '1min',
  FiveMinutes = '5min',
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

  @IsISO8601({}, { message: 'queryDate must be a valid ISO 8601 date string' })
  requestTime: string;
}
