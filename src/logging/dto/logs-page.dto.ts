import { ApiProperty } from '@nestjs/swagger';
import { RequestLogEntity } from '../entities/request-log.entity';

export class LogsPageDto {
  @ApiProperty({ type: [RequestLogEntity] })
  items: RequestLogEntity[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;
}
