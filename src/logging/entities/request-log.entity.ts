import { Entity, ObjectIdColumn, Column, Index } from 'typeorm';
import { ObjectId } from 'mongodb';
import { ApiProperty } from '@nestjs/swagger';

@Entity('request_logs')
export class RequestLogEntity {
  @ObjectIdColumn()
  @ApiProperty({ type: String, description: 'Mongo ObjectId' })
  _id: ObjectId;

  @Index()
  @Column({ type: 'string' })
  @ApiProperty({ example: '192.168.0.1' })
  ip: string;

  @Column({ nullable: true })
  @ApiProperty({ required: false, example: 'US' })
  country?: string;

  @Column({ nullable: true })
  @ApiProperty({ required: false, example: 'windows' })
  os?: string;

  @Column()
  @ApiProperty()
  userAgent: string;

  @Column()
  @ApiProperty({ description: 'true -> black page, false -> white page' })
  passed: boolean;

  @Column()
  @ApiProperty({ description: "reason why failed or 'ok'" })
  reason: string;

  @Column()
  @ApiProperty({ type: String })
  createdAt: Date;
}
