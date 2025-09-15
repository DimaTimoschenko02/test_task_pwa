import { ApiProperty } from '@nestjs/swagger';
import { CreateAppConfigDto } from './create-app-config.dto';
import { IsString } from 'class-validator';

export class UpdateAppConfigDto extends CreateAppConfigDto {
  @ApiProperty({ type: 'string' })
  @IsString()
  _id: string;
}
