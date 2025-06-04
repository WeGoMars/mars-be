import { IsString, IsEnum, Max, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';


// export enum Option {
//   MINE = 'mine',
//   HOT = 'hot',
//   LIKE = 'like',
//   NONE = 'none'
// }

export class SearchStocksDto {
  @IsString()
  query: string;

  @Type(() => Number)
  @IsNumber()
  @Max(20, { message: 'limit must be 20 or less' })
  limit: number

  // @IsEnum(Option, {
  //   message: `option must be one of: ${Object.values(Option).join(', ')}`,
  // })
  // option: Option;
}
