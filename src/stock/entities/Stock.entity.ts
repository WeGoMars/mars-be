import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  OneToMany,
} from 'typeorm';
import { StockOhlcv } from './Stock-Ohlcv.entity';

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
  market: string;

  @Column()
  sector: string;

  @Column()
  industry: string;

  @OneToMany(() => StockOhlcv, ohlcv => ohlcv.stock)
  ohlcvs: StockOhlcv[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

}
