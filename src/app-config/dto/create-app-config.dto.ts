import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ManifestDto } from './manifest.dto';

export class CreateAppConfigDto {
  @ApiProperty({ type: [String] })
  @IsArray()
  os_allow: string[];

  @ApiProperty({ type: [String] })
  @IsArray()
  country_allow: string[];

  @ApiProperty({ type: ManifestDto })
  @ValidateNested()
  @Type(() => ManifestDto)
  manifest: ManifestDto;
}
