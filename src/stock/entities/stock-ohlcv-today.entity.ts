import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Stock } from './stock.entity';


@Entity()
@Unique('UQ_STOCK_OHLCV_TODAY', ['stock', 'interval'])
@Index('IDX_STOCK_OHLCV_TODAY', ['stock', 'interval'])
export class StockOhlcvToday {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Stock, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'stock_id' })
  stock: Stock;

  @Column({
    type: 'enum',
    enum: ['15min', '60min'],
  })
  interval: '15min' | '60min';

  @Column({ type: 'datetime' }) // 해당 캔들의 기준 시각
  timestamp: Date;

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
