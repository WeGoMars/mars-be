import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPreference } from './entities/user-preference.entity';
import { PortfolioModule } from 'src/portfolio/portfolio.module';
import { StockModule } from 'src/stock/stock.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserPreference]),
    PortfolioModule,
    StockModule,
  ],
  providers: [AiService],
  controllers: [AiController],
})
export class AiModule {}
