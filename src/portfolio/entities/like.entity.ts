import { StockLatestPriceView } from 'src/stock/entities/stock-latest-price.view';
import { Stock } from 'src/stock/entities/stock.entity';
import { User } from 'src/users/entities/user.entity';
import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['user','stock'])
export class Like {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.likes)
  user: User;

  @ManyToOne(() => Stock)
  stock: Stock;

  @CreateDateColumn()
  createdAt: Date;

  stockView?:StockLatestPriceView;
}
