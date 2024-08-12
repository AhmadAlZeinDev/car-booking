import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (errors) => {
        function mapError(error) {
          const res = Object.keys(error.constraints).map((key) => ({
            name: error.property,
            key,
            message: error.constraints[key],
          }));
          return res[0];
        }

        const result = errors.map((error) => {
          return error?.constraints
            ? errors.map(mapError)
            : error?.children[Object.keys(error.children)[0]].children.map(
                mapError,
              );
        });
        return new BadRequestException(result[0]);
      },
      stopAtFirstError: false,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(configService.get<number>('PORT') || 3000);
}
bootstrap();
