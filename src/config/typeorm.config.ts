import 'dotenv/config';
import { DataSourceOptions } from 'typeorm';
import { AppConfigEntity } from '../app-config/entities/app-config.entity';
import { RequestLogEntity } from '../logging/entities/request-log.entity';

export const typeOrmMongoConfig = async (): Promise<DataSourceOptions> => {
  const url = process.env.MONGO_URL || 'mongodb://localhost:27017/test_db';
  return {
    type: 'mongodb',
    url,
    synchronize: true,
    autoLoadEntities: true,
    entities: [AppConfigEntity, RequestLogEntity],
  } as DataSourceOptions;
};
