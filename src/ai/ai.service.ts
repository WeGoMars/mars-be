import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserPreference } from './entities/user-preference.entity';
import { Repository } from 'typeorm';
import { UserDto } from 'src/users/dtos/response/user.dto';
import { CreateUserPreferenceDto } from './dtos/request/create-user-preference.dto';

@Injectable()
export class AiService {
    constructor(
        @InjectRepository(UserPreference)private prefRepo:Repository<UserPreference>
    ){}

    async createUserPreference(user:UserDto, dto:CreateUserPreferenceDto){
        const pref = this.prefRepo.create({
            ...dto,
            user:{id:user.id}
        });

        return await this.prefRepo.save(pref);
    }
}
