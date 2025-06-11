import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserPreference } from './entities/user-preference.entity';
import { Repository } from 'typeorm';
import { UserDto } from 'src/users/dtos/response/user.dto';
import { CreateUserPreferenceDto } from './dtos/request/create-user-preference.dto';
import { PortfolioService } from 'src/portfolio/portfolio.service';
import { StockService } from 'src/stock/stock.service';
import { RecommendationResponse } from './dtos/response/recommandation.dto';

@Injectable()
export class AiService {
  constructor(
    @InjectRepository(UserPreference)
    private prefRepo: Repository<UserPreference>,
    private pfService: PortfolioService,
    private stockService: StockService,
  ) {}

  async upsertUserPreference(user: UserDto, dto: CreateUserPreferenceDto) {
    const existing = await this.prefRepo.findOne({
      where: { user: { id: user.id } },
    });

    if (existing) {
      // 업데이트
      this.prefRepo.merge(existing, {
        ...dto,
      });
      return await this.prefRepo.save(existing);
    } else {
      // 신규 생성
      const newPref = this.prefRepo.create({
        ...dto,
        user: { id: user.id },
      });
      return await this.prefRepo.save(newPref);
    }
  }

  async getPreference(user: UserDto) {
    const data = await this.prefRepo.findOne({
      where: { user: { id: user.id } },
    });
    if (!data) {
      throw new BadRequestException('you did not created your user preference');
    }
    return data;
  }

  async getPerfectPF(user: UserDto) {
    const simplePF = await this.pfService.getMySimplePF(user);
    const stockPF = await this.pfService.getMyStockPortfolio(user);
    const marketReport = await this.stockService.getMarketData();
    const userPreference = await this.getPreference(user);

    const payload = {
      simplePF,
      stockPF,
      marketReport,
      userPreference,
    };

    const response = await fetch('http://ai-recommendations:5000/recommend/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result: RecommendationResponse = await response.json();
    return result;
  }
}
