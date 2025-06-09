export class UserPortfolioDto {
  totalAsset: number;       // 총 자산 = 현금 + 평가금액
  investedAmount: number;   // 실제 투자금
  evalGain: number;         // 평가 손익
  returnRate: number;       // 수익률
  totalSeed: number;        // 시드 머니
  investRatio: number;      // 총 투자 비율
  cash: number;             // 현재 현금 보유액

  constructor(partial: Partial<UserPortfolioDto>) {
    Object.assign(this, partial);
  }
}
