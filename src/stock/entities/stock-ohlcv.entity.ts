import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Unique,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn
} from 'typeorm';
import { Stock } from './stock.entity';


@Entity()
@Unique('UQ_STOCK_OHLCV',['stock', 'timestamp', 'interval'])
@Index('IDX_STOCK_OHLCV', ['stock', 'timestamp', 'interval'])
export class StockOhlcv {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Stock, stock => stock.ohlcvs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'stock_id' })
  stock: Stock;

  @Column({ type: 'date' })
  timestamp: string;

  @Column()
  interval: '1day' | '1week' | '1month';

  @Column('float')
  open: number;

  @Column('float')
  high: number;

  @Column('float')
  low: number;

  @Column('float')
  close: number;

  @Column('float')
  volume: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
