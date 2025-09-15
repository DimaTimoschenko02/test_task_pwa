import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsDate, IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class GetLogsQueryDto {
  @ApiPropertyOptional({ description: 'IP адрес для фильтрации' })
  @IsOptional()
  @IsString()
  ip?: string;

  @ApiPropertyOptional({ description: 'Страна (ISO, верхний регистр)' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ description: 'ОС (lowercase, без пробелов)' })
  @IsOptional()
  @IsString()
  os?: string;

  @ApiPropertyOptional({ description: 'Пройден ли фильтр (true/false)' })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined) return undefined;
    if (typeof value === 'boolean') return value;
    const v = String(value).toLowerCase();
    return v === '1' || v === 'true' || v === 'yes';
  })
  @IsBoolean()
  passed?: boolean;

  @ApiPropertyOptional({
    description: 'Дата/время c (ISO)',
    type: String,
    example: '2025-01-01T00:00:00.000Z',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  from?: Date;

  @ApiPropertyOptional({
    description: 'Дата/время по (ISO)',
    type: String,
    example: '2025-01-31T23:59:59.999Z',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  to?: Date;

  @ApiPropertyOptional({ description: 'Номер страницы (1+)', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Размер страницы (1..100)', default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;

  @ApiPropertyOptional({
    description: 'Сортировка по времени',
    enum: ['asc', 'desc'],
    default: 'desc',
  })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  order?: 'asc' | 'desc' = 'desc';
}
