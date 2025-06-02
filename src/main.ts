import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { join } from 'path';
const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.setGlobalPrefix('api');

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
