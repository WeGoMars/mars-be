import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Stock } from "src/stock/entities/stock.entity";
import { User } from "src/users/entities/user.entity";

export enum TradeType {
  BUY = 'buy',
  SELL = 'sell',
}

@Entity()
export class Trade {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.trades)
  user: User;

  @ManyToOne(() => Stock)
  stock: Stock;

  @Column({ type: 'enum', enum: TradeType })
  type: TradeType;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'float'})
  price: number;

  @CreateDateColumn()
  createdAt: Date;
}
