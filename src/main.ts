import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as morgan from 'morgan';
import { AppModule } from './app.module';
import { CORS } from './constants/cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configServices = app.get(ConfigService);

  app.use(morgan('dev'));

  app.setGlobalPrefix('v1');

  app.enableCors(CORS);
  await app.listen(configServices.get('PORT'));
  console.log(`App running on : ${await app.getUrl()}`);
}
bootstrap();
