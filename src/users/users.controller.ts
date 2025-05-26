import { Body, Controller, Get, Param, Query, Post} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dto/user.dto';
import { AuthService } from './auth.service';
import { SigninDto } from './dto/signin.dto';

@Serialize(UserDto)
@Controller('users')
export class UsersController {
    constructor(
        private usersService: UsersService,
        private authService: AuthService
    ) { }

    @Post()
    async createUser(@Body() body: CreateUserDto) {
        const user = await this.authService.signup(body);
        return user;
    }

    @Post('/login')
    async login(@Body() body:SigninDto){
        const user = await this.authService.signin(body);
        return user;
    }

    @Get()
    findByEmail(@Query('email') email: string) {
        return this.usersService.findOne(email);
    }    
}
