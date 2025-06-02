import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stock } from './entities/stock.entity';
import { StockOhlcv } from './entities/stock-ohlcv.entity';

@Injectable()
export class StockService {
    constructor(
        @InjectRepository(Stock) private stockRepo:Repository<Stock>
    ){}

    getSymbols(){
        return this.stockRepo.find({
            select: ['id','symbol'],
        });
    }
}
