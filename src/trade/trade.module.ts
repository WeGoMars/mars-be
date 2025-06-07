import { Module } from '@nestjs/common';
import { TradeService } from './trade.service';
import { TradeController } from './trade.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trade } from './entities/trade.entity';
import { UsersModule } from 'src/users/users.module';
import { StockModule } from 'src/stock/stock.module';
import { WalletModule } from 'src/wallet/wallet.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Trade]),
    UsersModule,
    StockModule,
    WalletModule,
  ],
  providers: [TradeService],
  controllers: [TradeController],
})
export class TradeModule {}
