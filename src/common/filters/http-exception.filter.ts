import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    // Handle validation errors
    if (status === HttpStatus.BAD_REQUEST && typeof exceptionResponse === 'object' && 'message' in exceptionResponse) {
      const messages = exceptionResponse['message'] as string[];

      // Transform the messages into the desired format
      const errors = messages.reduce((acc, msg) => {
        // Extract field name and error message
        const match = msg.match(/^(?<field>\w+)\s* .+/);
        if (match && match.groups) {
          const field = match.groups.field;
          if (!acc[field]) {
            acc[field] = [];
          }
          acc[field].push(msg);
        }
        return acc;
      }, {} as { [key: string]: string[] });

      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: errors, // Grouped validation errors
      });
    } else {
      // For other types of exceptions
      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: exceptionResponse,
      });
    }
  }
}
