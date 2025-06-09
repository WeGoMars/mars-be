import { Controller, Post, Session } from '@nestjs/common';
import { AiService } from './ai.service';
import { CreateUserPreferenceDto } from './dtos/request/create-user-preference.dto';
import { getUserOrThrow } from 'src/utils/getUserOrThrow';

@Controller('ai')
export class AiController {
  constructor(private aiService: AiService) {}

  @Post('/preference')
  async createPreference(@Session() session: any, dto: CreateUserPreferenceDto) {
    const user = getUserOrThrow(session);
    const data = await this.aiService.createUserPreference(user,dto);
  }
}
