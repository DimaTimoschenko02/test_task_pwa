import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ManifestIconDto {
  @ApiProperty()
  @IsString()
  src: string;

  @ApiProperty()
  @IsString()
  sizes: string;

  @ApiProperty()
  @IsString()
  type: string;
}

export class ManifestDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  short_name: string;

  @ApiProperty()
  @IsString()
  start_url: string;

  @ApiProperty()
  @IsString()
  display: string;

  @ApiProperty()
  @IsString()
  theme_color: string;

  @ApiProperty()
  @IsString()
  background_color: string;

  @ApiProperty({ type: [ManifestIconDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ManifestIconDto)
  icons: ManifestIconDto[];
}
