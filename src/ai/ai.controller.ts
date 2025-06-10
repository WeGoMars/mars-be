import { Body, Controller, Get, Post, Session } from '@nestjs/common';
import { AiService } from './ai.service';
import { CreateUserPreferenceDto } from './dtos/request/create-user-preference.dto';
import { getUserOrThrow } from 'src/utils/getUserOrThrow';
import { BaseResponseDto } from 'src/common/dtos/base-response.dto';
import { UserPreference } from './entities/user-preference.entity';

@Controller('ai')
export class AiController {
  constructor(private aiService: AiService) {}

  @Post('/preference')
  async createPreference(@Session() session: any, @Body()dto: CreateUserPreferenceDto) {
    const user = getUserOrThrow(session);
    const {id, ...data} = await this.aiService.upsertUserPreference(user,dto);
    return new BaseResponseDto(data,'user preference saved!');
  }

  @Get('Preference')
  async getPreference(@Session() session: any){
    const loginUser = getUserOrThrow(session);
    const {id, user, ...data} = await this.aiService.getPreference(loginUser) as UserPreference;
    return new BaseResponseDto(data,'this is your user preference');
  }

  @Get('recommend')
  async getRecommend(@Session() session: any){
    const user = getUserOrThrow(session);
    const data = await this.aiService.getPerfectPF(user);
    return new BaseResponseDto(data,'AI answer');
  }



}
