import { Body, Controller, Get, Param, Query, Post, Session, NotFoundException, HttpCode, Patch } from '@nestjs/common';
import { CreateUserDto } from './dtos/request/create-user.dto';
import { UsersService } from './users.service';
import { BaseResponseDto } from 'src/common/dtos/base-response.dto';
import { UserDto } from './dtos/response/user.dto';
import { AuthService } from './auth.service';
import { SigninDto } from './dtos/request/signin.dto';
import { UpdateNicknameDto } from './dtos/request/update-nickname.dto';
import { getUserOrThrow } from 'src/utils/getUserOrThrow';

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
    @Patch()
    async updateNickname(@Body() body: UpdateNicknameDto, @Session() session: any) {
        if (!session.user) throw new NotFoundException("Not logged in");

        const updatedUser = await this.usersService.updateNickname(session.user.id, body.nick);

        session.user.nick = updatedUser.nick;

        return new BaseResponseDto<UserDto>(
            new UserDto(updatedUser.id, updatedUser.email, updatedUser.nick),
            "닉네임이 수정되었습니다."
        );
    }

    @Get('/logout')
    async logout(@Session() session: any) {
        getUserOrThrow(session);
        session.user = null;
        return new BaseResponseDto<any>(null, "logout successful.");
    }


}
