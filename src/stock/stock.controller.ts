import { BadRequestException, Controller, Get, Param, Query } from '@nestjs/common';
import { BaseResponseDto } from 'src/common/dtos/base-response.dto';
import { ChartRequestDto } from './dtos/request/chart-request.dto';
import { SearchStocksDto } from './dtos/request/search-stocks.dto';
import { StockService } from './stock.service';
import { ListStocksDto, Option } from './dtos/request/list-stocks.dto';
import { SearchedStock } from './dtos/response/searched-stock.dto';

@Controller('stocks')
export class StockController {
    constructor(private stockService: StockService) { }
    @Get('/symbols')
    getSymbols() {
        return this.stockService.getSymbols();
    }

    @Get('/chart')
    async getChart(@Query() query: ChartRequestDto) {
        const data = await this.stockService.getChart(query);
        const response = new BaseResponseDto(data, `${query.symbol}'s chart data`);
        return response;
    }

    @Get('search')
    async searchStocks(@Query() query: SearchStocksDto) {
        const data = await this.stockService.searchStocksByNameAndSymbol(query);
        const response = new BaseResponseDto(data, 'search succesful');
        return response;
    }

    @Get('list')
    async listStocks(@Query() query: ListStocksDto) {
        let data: SearchedStock[] = [];
        switch(query.option){
            case Option.HOT:
                data = await this.stockService.listHotStocks(query);
                break;
            default:
                throw new BadRequestException('아직 HOT 이외엔 미구현');
        }

        const response = new BaseResponseDto(data, 'listing succesful');
        return response;
    }


    @Get('/:id')
    async getDetailedStock(@Param('id') param: string) {
        const data = await this.stockService.getDetailedStock(param);
        const response = new BaseResponseDto(data, `${param}'s detailed data`);
        return response;
    }
}
