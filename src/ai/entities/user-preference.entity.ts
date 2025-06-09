import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

export enum RiskLevel {
  LOW = 'low',
  HIGH = 'high',
}

export enum InvestmentStrategy {
  DIVIDEND_STABILITY = 'dividend_stability',
  PORTFOLIO_BALANCE = 'portfolio_balance',
  VALUE_STABILITY = 'value_stability',
  MOMENTUM = 'momentum',
  SECTOR_ROTATION = 'sector_rotation',
  REBOUND_BUY = 'rebound_buy',
}

export enum Sector {
  BASIC_MATERIALS = 'Basic Materials',
  COMMUNICATION_SERVICES = 'Communication Services',
  CONSUMER_CYCLICAL = 'Consumer Cyclical',
  CONSUMER_DEFENSIVE = 'Consumer Defensive',
  ENERGY = 'Energy',
  FINANCIAL_SERVICES = 'Financial Services',
  HEALTHCARE = 'Healthcare',
  INDUSTRIALS = 'Industrials',
  REAL_ESTATE = 'Real Estate',
  TECHNOLOGY = 'Technology',
  UTILITIES = 'Utilities',
}

@Entity()
export class UserPreference {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.preference, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @Column({
    type: 'enum',
    enum: RiskLevel,
  })
  riskLevel: RiskLevel;

  @Column({
    type: 'enum',
    enum: InvestmentStrategy,
    array: true,
  })
  preferredStrategies: InvestmentStrategy[];

  @Column({
    type: 'enum',
    enum: Sector,
    array: true,
  })
  preferredSectors: Sector[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
