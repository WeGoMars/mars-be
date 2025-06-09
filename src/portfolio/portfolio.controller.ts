import { Body, Controller, Delete, Get, Post, Session } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { getUserOrThrow } from 'src/utils/getUserOrThrow';
import { LikeDto } from './dtos/request/like.dto';
import { BaseResponseDto } from 'src/common/dtos/base-response.dto';

@Controller('portfolios')
export class PortfolioController {
  constructor(private portfolioService: PortfolioService) {}

  @Post('like')
  async createLike(@Session() session: any, @Body() dto: LikeDto) {
    const user = getUserOrThrow(session);
    const data = await this.portfolioService.createLike(user, dto);
    return new BaseResponseDto(data, `you liked ${dto.symbol} succesfully`);
  }

  @Delete('like')
  async deleteLike(@Session() session: any, @Body() dto: LikeDto) {
    const user = getUserOrThrow(session);
    const data = await this.portfolioService.deleteLike(user, dto);
    return new BaseResponseDto(data, `you disliked ${dto.symbol} succesfully`);
  }
  @Get('like')
  async getLike(@Session() session: any) {
    const user = getUserOrThrow(session);
    const data = await this.portfolioService.getMyLikes(user);
    return new BaseResponseDto(data, 'your likes successfully listed');
  }

  @Get('list')
  async getPortfolio(@Session() session: any) {
    const user = getUserOrThrow(session);
    const data = await this.portfolioService.getMyStockes(user);
    return new BaseResponseDto(data, 'your stock list');
  }

  // @Get('test')
  // async test(@Session() session: any) {
  //   const user = getUserOrThrow(session);
  //   const data = await this.portfolioService.aggregateUserPortfolio(user);
  //   console.log(data);
  // }
  @Get('overall')
  async getMySimplePF(@Session() session: any) {
    const user = getUserOrThrow(session);
    const data = await this.portfolioService.getMySimplePF(user);
    return new BaseResponseDto(data, 'this is your simple user PF!');
  }

  @Get('stock')
  async getMyStockPF(@Session() session: any) {
    const user = getUserOrThrow(session);
    const data = await this.portfolioService.getMyStockPortfolio(user);
    return new BaseResponseDto(data, 'this is your stock PF!');
  }
}
