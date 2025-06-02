import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { join } from 'path';
const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
   app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://13.220.145.152:3000'
    ],  // 프론트엔드 주소
    credentials: true,                // 쿠키, 인증 포함
  });
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }))
  app.use(cookieSession({
    keys: ["mysessionkey"]
  }))
  app.useGlobalFilters(new HttpExceptionFilter());


  await app.listen(process.env.PORT ?? 4000);
  
}
bootstrap();
