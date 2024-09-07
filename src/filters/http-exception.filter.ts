import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiResponse } from 'src/common/ApiResponse/api-response';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    const message =
      typeof exceptionResponse === 'object'
        ? exceptionResponse['message']
        : exceptionResponse;

    response
      .status(status)
      .json(
        new ApiResponse(
          status,
          message || 'An error occurred',
          new Date(),
          null,
        ),
      );
  }
}
