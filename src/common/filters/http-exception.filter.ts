// src/common/filters/http-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';


@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    const resBody = exception.getResponse();
    const message =
      typeof resBody === 'string'
        ? resBody
        : (resBody as any).message || 'unknown error';

    response.status(status).json({
      success: false,
      message,
    });
  }
}
