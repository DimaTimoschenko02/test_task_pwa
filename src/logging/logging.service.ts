import { Injectable } from '@nestjs/common';
import { RequestLogEntity } from './entities/request-log.entity';
import { LoggingRepository } from './logging.repository';
import { GetLogsQueryDto } from './dto/get-logs.query.dto';
import { LogsPageDto } from './dto/logs-page.dto';

@Injectable()
export class LoggingService {
  constructor(private readonly loggingRepository: LoggingRepository) {}

  public async log(data: Omit<RequestLogEntity, '_id'>): Promise<void> {
    const entity = this.loggingRepository.create(data);
    await this.loggingRepository.save(entity);
  }

  public async getLogs(query: GetLogsQueryDto): Promise<LogsPageDto> {
    const { page = 1, limit = 20, order = 'desc', ip, country, os, passed, from, to } = query;
    return this.loggingRepository.findWithFilters({
      page,
      limit,
      order,
      ip,
      country,
      os,
      passed,
      from,
      to,
    });
  }
}
