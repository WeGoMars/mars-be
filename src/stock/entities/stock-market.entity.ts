import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  Index,
} from 'typeorm';

export enum MarketMetricType {
  FEDFUNDS_AVERAGE = 'FEDFUNDS_AVERAGE',
  VIX = 'VIX',
  SNP500_DAILY_RETURN = 'SNP500_DAILY_RETURN',
}

@Entity()
@Unique('UQ_MARKET_METRIC', ['name', 'timestamp'])
@Index('IDX_MARKET_METRIC', ['name', 'timestamp'])
export class StockMarket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: MarketMetricType,
  })
  name: MarketMetricType;

  @Column({ type: 'date' })
  timestamp: string;

  @Column('float')
  value: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
