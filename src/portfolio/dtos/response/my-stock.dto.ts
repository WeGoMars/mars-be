

export class MyStock {
  symbol: string;
  name: string;
  sector: string;
  industry: string;
  currentPrice: number;
  priceDelta: number;

  constructor(partial:Partial<MyStock>){
    Object.assign(this,partial);
  }
}
