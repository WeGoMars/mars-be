import { Body, Controller, Get, Param, Query, Post} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dto/user.dto';

@Serialize(UserDto)
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Post()
    createUser(@Body() body: CreateUserDto) {
        return this.usersService.create(body);
    }

    @Get()
    findByEmail(@Query('email') email: string) {
        return this.usersService.findOne(email);
    }

    @Get()
    findAll() {
        return this.usersService.findAll();
    }
}
