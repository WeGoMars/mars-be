
export class TradeResultDto{
    symbol: string;
    price: number;
    balance: number;
    share:number;
    tradedAt: Date;

    constructor(partial:Partial<TradeResultDto>){
        Object.assign(this,partial);
    }
}