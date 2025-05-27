import { Body, Controller, Get, Param, Query, Post, Session, NotFoundException, HttpCode } from '@nestjs/common';
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
    async createUser(@Body() body: CreateUserDto, @Session() session: any) {
        const user = await this.authService.signup(body);
        session.user = user;
        return user;
    }

    @Post('/login')
    @HttpCode(200)
    async login(@Body() body: SigninDto, @Session() session: any) {
        const user = await this.authService.signin(body);
        session.user = user;
        return user;
    }

    @Get('whoami')
    whoami(@Session() session:any){
        return session.user;
    }

    @Get()
    findByEmail(@Query('email') email: string) {
        return this.usersService.findOne(email);
    }
}
