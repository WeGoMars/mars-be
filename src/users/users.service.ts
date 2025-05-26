import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UsersService {
    private count = 3;
    private users = [
        { id: 1, email:"aa@aaa.com", password:"123",nick: 'Alice' },
        { id: 2, email:"bb@bbb.com", password:"1234",nick: 'Bob' }
    ];

    findAll() {
        return this.users;
    }

    findOne(id: number) {
        return this.users.find(user => user.id === id);
    }

    create(user:CreateUserDto){
        this.users.push({
            id: this.count++, 
            email: user.email,
            password: user.password,
            nick: user.nick
        });
    };

}
