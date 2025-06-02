import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

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
    
    async updateNickname(userId: number, newNick: string) {
        const user = await this.repo.findOneBy({ id: userId });
        if (!user) throw new NotFoundException("User not found");

        user.nick = newNick;
        await this.repo.save(user);

        return user;
    }
}

