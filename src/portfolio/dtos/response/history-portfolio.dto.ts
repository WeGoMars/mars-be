export class HistoryPortfolioDto {
  symbol: string;         // 종목 코드 (예: AAPL)
  name: string;           // 종목 이름 (예: Apple Inc.)
  quantity: number;       // 매수 수량& 매도 수량
  currentPrice: number;    //거래발생 당시 단가
  createdAt: Date;        // 거래 발생 시각
  returnRate: number;     // 수익률 = 평가손익 / 매입금액

  constructor(partial: Partial<HistoryPortfolioDto>) {
    Object.assign(this, partial);
  }
}
