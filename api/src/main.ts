import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
 
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  

  app.use(cookieParser());
  

  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (errors) => {
        return new BadRequestException(
          errors.map(err => ({
            field: err.property,
            errors: Object.values(err.constraints ?? {}),
          })),
        );
      },
    }),
  );
  
  app.setGlobalPrefix('api');
  await app.listen(8080);
}
 
bootstrap();