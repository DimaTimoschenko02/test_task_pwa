import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoggingService } from './logging.service';
import { GetLogsQueryDto } from './dto/get-logs.query.dto';
import { LogsPageDto } from './dto/logs-page.dto';

@ApiTags('logs')
@Controller()
export class LoggingController {
  constructor(private readonly logging: LoggingService) {}

  @Get('logs')
  @ApiOperation({ summary: 'Get logs with filters and pagination' })
  @ApiOkResponse({ type: LogsPageDto })
  public getLogs(@Query() query: GetLogsQueryDto): Promise<LogsPageDto> {
    return this.logging.getLogs(query);
  }
}
