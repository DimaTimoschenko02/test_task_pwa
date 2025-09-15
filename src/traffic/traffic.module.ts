import { Module } from '@nestjs/common';
import { TrafficService } from './traffic.service';
import { AppConfigModule } from '../app-config/app-config.module';

@Module({
  imports: [AppConfigModule],
  providers: [TrafficService],
  exports: [TrafficService],
})
export class TrafficModule {}
