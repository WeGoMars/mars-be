import { IsString, IsEnum, Max, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';


export enum Option {
    HOT = 'hot',
    OWNED = 'owned',
    LIKED = 'liked',
}

export class ListStocksDto {

    @Type(() => Number)
    @IsNumber()
    @Max(20, { message: 'limit must be 20 or less' })
    limit: number

    @IsEnum(Option, {
      message: `option must be one of: ${Object.values(Option).join(', ')}`,
    })
    option: Option;
}
