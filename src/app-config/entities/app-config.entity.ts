import { Entity, ObjectIdColumn, Column, UpdateDateColumn, CreateDateColumn } from 'typeorm';
import { ObjectId } from 'mongodb';
import { ApiProperty } from '@nestjs/swagger';

@Entity('app_config')
export class AppConfigEntity {
  @ObjectIdColumn()
  @ApiProperty({ type: String })
  _id: ObjectId;

  @Column({ type: Boolean, default: false })
  @ApiProperty()
  active: boolean = false;

  @Column()
  @ApiProperty({ type: [String] })
  os_allow: string[];

  @Column()
  @ApiProperty({ type: [String] })
  country_allow: string[];

  @Column()
  @ApiProperty({
    type: 'object',
    properties: {
      name: { type: 'string' },
      short_name: { type: 'string' },
      start_url: { type: 'string' },
      display: { type: 'string' },
      theme_color: { type: 'string' },
      background_color: { type: 'string' },
      icons: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            src: { type: 'string' },
            sizes: { type: 'string' },
            type: { type: 'string' },
          },
        },
      },
    },
  })
  manifest: {
    name: string;
    short_name: string;
    start_url: string;
    display: string;
    theme_color: string;
    background_color: string;
    icons: { src: string; sizes: string; type: string }[];
  };

  @UpdateDateColumn()
  @ApiProperty({ type: Date, required: false })
  updated_at: Date;

  @CreateDateColumn()
  @ApiProperty({ type: Date, required: false })
  created_at: Date;
}
