import { Controller, Post, Session } from '@nestjs/common';
import { AiService } from './ai.service';
import { CreateUserPreferenceDto } from './dtos/request/create-user-preference.dto';

@Controller('ai')
export class AiController {
  constructor(private aiService: AiService) {}

  @Post('/preference')
  createPreference(@Session() session: any, dto: CreateUserPreferenceDto) {
    
  }
}
