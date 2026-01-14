import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Prisma } from '../../generated/client';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';
    let error: string | undefined;

    // Nest HTTP-исключения (включая NotFound, Unauthorized, Forbidden и т.п.)
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null) {
        const r = res as { message?: string | string[]; error?: string };
        message = r.message ?? message;
        error = r.error;
      }

      // Явно выделим отдельные типы при необходимости кастомизации
      if (exception instanceof NotFoundException) {
        error = error ?? 'Not Found';
      } else if (exception instanceof UnauthorizedException) {
        error = error ?? 'Unauthorized';
      } else if (exception instanceof ForbiddenException) {
        error = error ?? 'Forbidden';
      }
    }
    // Ошибки Prisma
    else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      // Наиболее частые коды
      switch (exception.code) {
        case 'P2002':
          status = HttpStatus.CONFLICT;
          message = 'Unique constraint violation';
          error = 'UniqueConstraintViolation';
          break;
        case 'P2025':
          status = HttpStatus.NOT_FOUND;
          message = 'Record not found';
          error = 'RecordNotFound';
          break;
        default:
          status = HttpStatus.BAD_REQUEST;
          message = `Database error (code ${exception.code})`;
          error = 'PrismaClientKnownRequestError';
          break;
      }
    } else if (exception instanceof Prisma.PrismaClientValidationError) {
      status = HttpStatus.BAD_REQUEST;
      message = 'Invalid data for database operation';
      error = 'PrismaClientValidationError';
    } else if (exception instanceof Prisma.PrismaClientInitializationError) {
      status = HttpStatus.SERVICE_UNAVAILABLE;
      message = 'Database initialization error';
      error = 'PrismaClientInitializationError';
    } else if (exception instanceof Prisma.PrismaClientRustPanicError) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Database internal error';
      error = 'PrismaClientRustPanicError';
    }
    // Обычные JS-ошибки
    else if (exception instanceof Error) {
      message = exception.message;
      error = exception.name;
    }

    response.status(status).json({
      statusCode: status,
      message,
      error,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}

