import { Controller, Get, Param, Query } from '@nestjs/common';
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
    async getChart(@Query() query : ChartRequestDto){
        const data= await this.stockService.getChart(query);
        const response = new BaseResponseDto(data,`${query.symbol}'s chart data`);
        return response;
    }

    @Get('/:id')
    async getDetailedStock(@Param('id')param :string){
        const data = await this.stockService.getDetailedStock(param);
        const response = new BaseResponseDto(data,`${param}'s detailed data`);
        return response;
    }
}
