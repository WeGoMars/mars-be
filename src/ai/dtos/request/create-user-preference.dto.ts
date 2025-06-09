import {
  IsEnum,
  IsArray,
  ArrayMinSize,
  IsOptional,
} from 'class-validator';
import { RiskLevel,Sector,InvestmentStrategy } from 'src/ai/entities/user-preference.entity';

export class CreateUserPreferenceDto {
  @IsEnum(RiskLevel)
  riskLevel: RiskLevel;

  @IsOptional()
  @IsArray()
  @IsEnum(InvestmentStrategy, { each: true })
  preferredStrategies?: InvestmentStrategy[];

  @IsArray()
  @ArrayMinSize(1, { message: '최소 하나 이상의 관심 섹터를 선택해야 합니다.' })
  @IsEnum(Sector, { each: true })
  preferredSectors: Sector[];
}
