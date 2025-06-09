export class StockPortfolioDto {
  symbol: string;         // 종목 코드 (예: AAPL)
  name: string;           // 종목 이름 (예: Apple Inc.)
  quantity: number;       // 보유 수량
  avgBuyPrice: number;    // 평균 매수 단가
  evalAmount: number;     // 현재 평가 금액 = 수량 * 현재가
  evalGain: number;       // 평가 손익 = 평가금액 - 매입금액
  returnRate: number;     // 수익률 = 평가손익 / 매입금액

  constructor(partial: Partial<StockPortfolioDto>) {
    Object.assign(this, partial);
  }
}