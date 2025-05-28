import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/request/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private repo: Repository<User>) { }

    async findOne(email: string): Promise<User | null> {
        return await this.repo.findOne({ where: { email } });
    };

    async create({email,password,nick}): Promise<User> {
        const user = this.repo.create({email,password,nick});
        return await this.repo.save(user);
    }

}
