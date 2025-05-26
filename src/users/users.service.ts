import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
    private users = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }];

    findAll() {
        return this.users;
    }

    findOne(id: number) {
        return this.users.find(user => user.id === id);
    }

    create(){
        
    }

}
