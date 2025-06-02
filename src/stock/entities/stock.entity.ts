import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  OneToMany,
} from 'typeorm';
import { StockOhlcv } from './stock-ohlcv.entity';
import { StockOhlcvToday } from './stock-ohlcv-today.entity';
import { StockFinancials } from './stock-financial.entity';

@Entity()
@Unique(['symbol'])
export class Stock {
  @PrimaryGeneratedColumn()
  
  id: number;

  @Column()
  symbol: string;

  @Column()
  name: string;

  @Column()
  sector: string;

  @Column()
  industry: string;

  @OneToMany(() => StockOhlcv, ohlcv => ohlcv.stock)
  ohlcvs: StockOhlcv[];

  @OneToMany(() => StockOhlcvToday, today => today.stock)
  ohlcvTodayList: StockOhlcvToday[];

  @OneToMany(() => StockFinancials, finance => finance.stock)
  financials: StockFinancials[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

}
