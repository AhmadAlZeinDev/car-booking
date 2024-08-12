/* eslint-disable prettier/prettier */
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    try {
      let status;
      try {
        status = exception.getStatus() || HttpStatus.BAD_REQUEST;
      } catch (ex) {
        status = HttpStatus.BAD_REQUEST;
      }

      let exceptionResponse;
      if (exception instanceof TypeError) {
        exceptionResponse = exception.message;
      } else {
        if (response && response['message']) {
          exceptionResponse = response['message'];
        } else if (
          exception &&
          exception.getResponse &&
          exception.getResponse()['message']
        ) {
          exceptionResponse = exception.getResponse()['message'];
        } else {
          exceptionResponse = exception?.message || 'Something wrong happened';
        }
      }

      const errorResponse = {
        success: false,
        data: exceptionResponse || 'Something wrong happened',
      };

      //Notify by Telegram Bot

      response.status(status).json(errorResponse);
    } catch (ex) {
      response.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        data: 'Something wrong happened',
      });
    }
  }
}
