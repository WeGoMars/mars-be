import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { Wallet } from './entities/wallet.entity';
import { UserDto } from 'src/users/dtos/response/user.dto';
import { CreateWalletDto } from './dtos/request/create-wallet.dto';
import { WalletDto } from './dtos/response/wallet.dto';
import { SimpleWalletDto } from './dtos/response/simple-wallet.dto';

@Injectable()
export class WalletService {
    constructor(
        @InjectRepository(User) private userRepo: Repository<User>,
        @InjectRepository(Wallet) private walletRepo: Repository<Wallet>
    ) { }

    async getWallet(user: UserDto) {

        const rawData = await this.userRepo.findOne({
            where: { id: user.id },
            relations: ['wallet']
        })
        if(!rawData?.wallet){
            throw new BadRequestException('this user have no wallet!');
        }
        const data = {
            email: rawData?.email,
            nick: rawData?.nick,
            cyberDollar: rawData?.wallet?.cyberDollar,
            updatedAt: rawData?.wallet?.updatedAt,
        }
        return new WalletDto(data);
    }

    async createWallet(user: UserDto, dto: CreateWalletDto) {
        let rawData: any;
        const wallet = this.walletRepo.create({
            user: { id: user.id },
            cyberDollar: dto.amount,
            cyberDollarAccum: dto.amount
        })
        try {
            const created = await this.walletRepo.save(wallet);
            const data = {
                email: user.email,
                nick: user.nick,
                cyberDollar: created.cyberDollar,
                updatedAt: created.updatedAt
            }
            return new WalletDto(data);

        } catch (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                throw new ConflictException('A user can only have one wallet');
            }
            throw new BadRequestException('알 수 없는 오류');
        }
    }

    async updateWalletBalance(user:UserDto, delta:number) {
        const wallet = await this.walletRepo.findOne({ where: { user: { id: user.id } } });

        if (!wallet) {
            throw new BadRequestException('This user has no wallet!');
        }
        if(delta>0){
            wallet.cyberDollarAccum +delta;
        }
        wallet.cyberDollar += delta;
        const rawData = await this.walletRepo.save(wallet);
        const data = {
            cyberDollar:rawData.cyberDollar,
            updatedAt:rawData.updatedAt
        }

        return new SimpleWalletDto(data);
    }
}