import { Type } from "class-transformer";
import { IsNumber, Max, Min } from "class-validator";

export class CreateWalletDto {

    @Type(() => Number)
    @IsNumber()
    @Max(100000, { message: 'amount must be 100000 or less' })
    @Min(-100000, { message: 'amount must be -100000 or more' })
    amount: number;
}