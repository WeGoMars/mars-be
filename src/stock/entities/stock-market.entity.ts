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
  SNP500_1M_RETURN = 'SNP500_1M_RETURN',
  SNP500_2M_RETURN = 'SNP500_2M_RETURN',
  SNP500_3M_RETURN = 'SNP500_3M_RETURN',
  SNP500_4M_RETURN = 'SNP500_4M_RETURN',
  SNP500_5M_RETURN = 'SNP500_5M_RETURN',
  SNP500_6M_RETURN = 'SNP500_6M_RETURN',
  SNP500_7M_RETURN = 'SNP500_7M_RETURN',
  SNP500_8M_RETURN = 'SNP500_8M_RETURN',
  SNP500_9M_RETURN = 'SNP500_9M_RETURN',
  SNP500_10M_RETURN = 'SNP500_10M_RETURN',
  SNP500_11M_RETURN = 'SNP500_11M_RETURN',
  SNP500_12M_RETURN = 'SNP500_12M_RETURN',
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
