import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPreference } from './entities/user-preference.entity';

@Module({
  imports:[TypeOrmModule.forFeature([UserPreference])],
  providers: [AiService],
  controllers: [AiController]
})
export class AiModule {}
