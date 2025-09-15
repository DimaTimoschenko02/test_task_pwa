import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigEntity } from './entities/app-config.entity';
import { AppConfigRepository } from './app-config.repository';
import { AppConfigService } from './app-config.service';
import { AppConfigController } from './app-config.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AppConfigEntity])],
  providers: [AppConfigRepository, AppConfigService],
  controllers: [AppConfigController],
  exports: [AppConfigService],
})
export class AppConfigModule {}
