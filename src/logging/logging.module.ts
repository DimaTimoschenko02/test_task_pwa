import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestLogEntity } from './entities/request-log.entity';
import { LoggingService } from './logging.service';
import { LoggingRepository } from './logging.repository';
import { LoggingController } from './logging.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RequestLogEntity])],
  providers: [LoggingRepository, LoggingService],
  controllers: [LoggingController],
  exports: [LoggingService],
})
export class LoggingModule {}
