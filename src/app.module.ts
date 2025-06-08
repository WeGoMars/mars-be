import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { StockModule } from './stock/stock.module';
import { WalletModule } from './wallet/wallet.module';
import { TradeModule } from './trade/trade.module';
import { PortfolioModule } from './portfolio/portfolio.module';

@Module({
  imports: [
    // 1. 환경변수 로딩
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'dev'}`,
    }),

    // 2. TypeORM 설정 (ConfigService 사용)
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_DATABASE'),
        // entities:[User],
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),

    // 3. 기타 모듈
    UsersModule,

    StockModule,

    WalletModule,

    TradeModule,

    PortfolioModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
