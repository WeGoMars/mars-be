import { Controller, Get, Session } from '@nestjs/common';
import { getUserOrThrow } from 'src/utils/getUserOrThrow';

@Controller('wallets')
export class WalletController {

    @Get()
    getWallet(@Session() session: any){
        getUserOrThrow(session);
        

    }
}
