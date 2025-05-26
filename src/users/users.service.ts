import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private repo: Repository<User>) { }

    async findOne(email: string): Promise<User | null> {
        return await this.repo.findOne({ where: { email } });
    };

    async create(createUserDto: CreateUserDto): Promise<User> {
        const user = this.repo.create(createUserDto);
        return await this.repo.save(user);
    }

    async findAll(): Promise<User[]> {
        return await this.repo.find();
    }

}
