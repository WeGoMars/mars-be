import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserPreference } from './entities/user-preference.entity';
import { Repository } from 'typeorm';
import { UserDto } from 'src/users/dtos/response/user.dto';
import { CreateUserPreferenceDto } from './dtos/request/create-user-preference.dto';

@Injectable()
export class AiService {
  constructor(
    @InjectRepository(UserPreference)
    private prefRepo: Repository<UserPreference>,
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
}
