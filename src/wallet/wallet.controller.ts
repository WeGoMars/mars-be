import { BadRequestException, Body, Controller, Get, Post, Put, Session } from '@nestjs/common';
import { getUserOrThrow } from 'src/utils/getUserOrThrow';
import { WalletService } from './wallet.service';
import { CreateWalletDto } from './dtos/request/create-wallet.dto';
import { BaseResponseDto } from 'src/common/dtos/base-response.dto';

@Controller('wallets')
export class WalletController {
    constructor(private walletService: WalletService) { }

    @Get()
    async getWallet(@Session() session: any) {
        const user = getUserOrThrow(session);

        const wallet = await this.walletService.getWallet(user);
        return new BaseResponseDto(wallet, 'get wallet success');
    }

    @Post()
    async createWallet(@Session() session: any, @Body() body: CreateWalletDto) {
        const user = getUserOrThrow(session);

        const wallet = await this.walletService.createWallet(user, body);
        return new BaseResponseDto(wallet, 'create wallet success');
    }

    @Put()
    async updateWallet(@Session() session: any, @Body() body: CreateWalletDto) {
        const user = getUserOrThrow(session);
        const simpleWallet =  await this.walletService.addSeedMoney(user, body.amount);
        return new BaseResponseDto(simpleWallet,'wallet updated successfully');
    }
}