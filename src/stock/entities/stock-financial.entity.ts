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
  @Unique('UQ_STOCK_FINANCIALS', ['stock', 'targetDate'])
  @Index('IDX_STOCK_FINANCIALS', ['stock', 'targetDate'])
  export class StockFinancials {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Stock, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'stock_id' })
    stock: Stock;

    @Column({ type: 'date' })
    targetDate: string; // 재무 데이터 기준일 (YYYY-MM-DD)

    @Column('float', { nullable: true })
    roe: number;

    @Column('float', { nullable: true })
    eps: number;

    @Column('float', { nullable: true })
    bps: number;

    @Column('float', { nullable: true })
    beta: number;

    @Column('float', { nullable: true })
    marketCap: number;

    @Column('float', { nullable: true })
    dividendYield: number;

    @Column('float', { nullable: true })
    currentRatio: number;

    @Column('float', { nullable: true })
    debtRatio: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    sector: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    industry: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
  }
