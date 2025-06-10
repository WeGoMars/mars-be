import { Body, Controller, Post, Session } from '@nestjs/common';
import { AiService } from './ai.service';
import { CreateUserPreferenceDto } from './dtos/request/create-user-preference.dto';
import { getUserOrThrow } from 'src/utils/getUserOrThrow';
import { BaseResponseDto } from 'src/common/dtos/base-response.dto';

@Controller('ai')
export class AiController {
  constructor(private aiService: AiService) {}

  @Post('/preference')
  async createPreference(@Session() session: any, @Body()dto: CreateUserPreferenceDto) {
    const user = getUserOrThrow(session);
    const {id, ...data} = await this.aiService.upsertUserPreference(user,dto);
    return new BaseResponseDto(data,'user preference saved!');
  }

}
