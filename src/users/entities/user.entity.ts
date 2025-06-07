import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, OneToMany } from 'typeorm';
import { Wallet } from 'src/wallet/entities/wallet.entity';
import { Trade } from 'src/trade/entities/trade.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column()
    nick: string;

    @OneToOne(() => Wallet, wallet => wallet.user, { nullable: true })
    wallet: Wallet | null;

    @OneToMany(() => Trade, trade => trade.user)
    trades: Trade[] | null;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}
