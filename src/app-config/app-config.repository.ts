import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { AppConfigEntity } from './entities/app-config.entity';
import { ObjectId } from 'mongodb';

@Injectable()
export class AppConfigRepository {
  constructor(
    @InjectRepository(AppConfigEntity)
    private readonly appConfig: MongoRepository<AppConfigEntity>,
  ) {}

  public async activateConfig(id: string): Promise<void> {
    await this.appConfig.updateOne({ active: true }, { $set: { active: false } });

    await this.appConfig.updateOne({ _id: new ObjectId(id) }, { $set: { active: true } });
  }

  public create(data: Partial<AppConfigEntity>): AppConfigEntity {
    return this.appConfig.create(data);
  }

  public async save(entity: AppConfigEntity): Promise<AppConfigEntity> {
    return this.appConfig.save(entity);
  }

  public async findAll(): Promise<AppConfigEntity[]> {
    return this.appConfig.find({ order: { updated_at: 'DESC' } });
  }

  public async findById(id: string): Promise<AppConfigEntity | null> {
    return this.appConfig.findOne({ where: { _id: new ObjectId(id) } });
  }

  public async findActive(): Promise<AppConfigEntity> {
    return this.appConfig.findOne({
      where: { active: true },
    }) as Promise<AppConfigEntity>;
  }

  public async remove(entity: AppConfigEntity): Promise<void> {
    await this.appConfig.remove(entity);
  }
}
