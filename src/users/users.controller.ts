import { Body, Controller, Get, Param, Query, Post, Session, NotFoundException, HttpCode } from '@nestjs/common';
import { CreateUserDto } from './dtos/request/create-user.dto';
import { UsersService } from './users.service';
import { BaseResponseDto } from 'src/common/dtos/base-response.dto';
import { UserDto } from './dtos/response/user.dto';
import { AuthService } from './auth.service';
import { SigninDto } from './dtos/request/signin.dto';

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
        const responseUser = new UserDto(user.id, user.email, user.nick);
        return new BaseResponseDto<UserDto>(responseUser, "User registered successfully.");
    }

    @Post('/login')
    async login(@Body() body: SigninDto, @Session() session: any) {
        const user = await this.authService.signin(body);
        session.user = user;
        const responseUser = new UserDto(user.id, user.email, user.nick);
        return new BaseResponseDto<UserDto>(responseUser, "sign in successful.");
    }

    @Get('whoami')
    whoami(@Session() session: any) {
        return session.user;
    }


}
