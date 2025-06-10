import { IsEnum, IsArray, ArrayMinSize, IsOptional } from 'class-validator';
import {
  RiskLevel,
  Sector,
  InvestmentStrategy,
} from 'src/ai/entities/user-preference.entity';

export class CreateUserPreferenceDto {
  @IsEnum(RiskLevel)
  riskLevel: RiskLevel;

  @IsOptional()
  @IsArray()
  @IsEnum(InvestmentStrategy, { each: true })
  preferredStrategies?: InvestmentStrategy[];

  @IsOptional()
  @IsArray()
  @IsEnum(Sector, { each: true })
  preferredSectors: Sector[];
}
