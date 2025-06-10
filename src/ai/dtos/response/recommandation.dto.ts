// src/ai/dtos/response/recommendation.dto.ts

export type RecommendationReasonType = 'strategy' | 'metric' | 'commentary';

export class RecommendationReason {
  type: RecommendationReasonType;
  detail: string;
  score: number;
}

export class RecommendedStock {
  symbol: string;
  name: string;
  score: number;
  sector: string;
  industry: string;
  reasons: RecommendationReason[];
}

export class RecommendationResponse {
  recommended: RecommendedStock[];
}
