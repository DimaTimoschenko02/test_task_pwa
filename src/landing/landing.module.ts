import { Module } from '@nestjs/common';
import { LandingService } from './landing.service';
import { LandingController } from './landing.controller';
import { TrafficModule } from '../traffic/traffic.module';
import { LoggingModule } from '../logging/logging.module';
import { AppConfigModule } from '../app-config/app-config.module';

@Module({
  imports: [TrafficModule, LoggingModule, AppConfigModule],
  providers: [LandingService],
  controllers: [LandingController],
})
export class LandingModule {}
