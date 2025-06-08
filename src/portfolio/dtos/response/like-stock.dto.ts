

export class LikeStock {
  symbol: string;
  name: string;
  sector: string;
  industry: string;
  currentPrice: number;
  priceDelta: number;

  constructor(partial:Partial<LikeStock>){
    Object.assign(this,partial);
  }
}
