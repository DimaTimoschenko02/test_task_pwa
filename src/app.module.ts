import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmMongoConfig } from './config/typeorm.config';
import { AppConfigModule } from './app-config/app-config.module';
import { LoggingModule } from './logging/logging.module';
import { TrafficModule } from './traffic/traffic.module';
import { LandingModule } from './landing/landing.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({ useFactory: typeOrmMongoConfig }),
    AppConfigModule,
    LoggingModule,
    TrafficModule,
    LandingModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
