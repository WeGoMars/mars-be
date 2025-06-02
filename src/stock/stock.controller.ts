import { Controller, Get, Query } from '@nestjs/common';
import { BaseResponseDto } from 'src/common/dtos/base-response.dto';
import { ChartRequestDto } from './dtos/request/chart-request.dto';
import { StockService } from './stock.service';

@Controller('stocks')
export class StockController {
    constructor(private stockService:StockService){}
    @Get('/symbols')
    getSymbols(){
        return this.stockService.getSymbols();
    }

    @Get('/chart')
    getChart(@Query() query : ChartRequestDto){
        console.log(query);
    }
    
}
