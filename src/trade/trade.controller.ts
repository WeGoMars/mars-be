import { Body, Controller, Post, Session } from '@nestjs/common';
import { TradeService } from './trade.service';
import { TradeStockDto } from './dtos/request/trade-stock.dto';
import { getUserOrThrow } from 'src/utils/getUserOrThrow';
import { BaseResponseDto } from 'src/common/dtos/base-response.dto';

@Controller('trades')
export class TradeController {
  constructor(private tradeService: TradeService) {}

  @Post('/buy')
  async buyStock(@Session() session: any, @Body() body: TradeStockDto) {
    const user = getUserOrThrow(session);
    const data = await this.tradeService.buyStock(user, body);
    return new BaseResponseDto(data, 'buy successful');
  }

  @Post('/sell')
  async sellStock(@Session() session: any, @Body() body: TradeStockDto) {
    const user = getUserOrThrow(session);
    const data = await this.tradeService.sellStock(user, body);
    return new BaseResponseDto(data, 'sell successful');
  }
}
