import { Module } from '@nestjs/common';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { User } from 'src/users/entities/user.entity';
import { Wallet } from './entities/wallet.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User,Wallet])],
  controllers: [WalletController],
  providers: [WalletService]
})
export class WalletModule { }
