import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }),
  );

  const config = new DocumentBuilder()
    .setTitle('Cloaking API')
    .setDescription('MVC cloaking (OS + Country)')
    .setVersion('0.1.0')
    .build();

  const doc = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('/docs', app, doc);

  await app.listen(port);

  console.log(`Listening on http://localhost:${port}`);
}
bootstrap();
