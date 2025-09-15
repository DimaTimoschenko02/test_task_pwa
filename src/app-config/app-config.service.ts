import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { AppConfigEntity } from './entities/app-config.entity';
import { CreateAppConfigDto } from './dto/create-app-config.dto';
import { UpdateAppConfigDto } from './dto/update-app-config.dto';
import { AppConfigRepository } from './app-config.repository';
import { ObjectId } from 'mongodb';

@Injectable()
export class AppConfigService {
  private cache: AppConfigEntity | null = null;

  constructor(private readonly appConfigRepository: AppConfigRepository) {}

  public async create(dto: CreateAppConfigDto): Promise<AppConfigEntity> {
    const config = this.appConfigRepository.create(dto);

    return this.appConfigRepository.save(config);
  }

  public async findAll(): Promise<AppConfigEntity[]> {
    return this.appConfigRepository.findAll();
  }

  public async findOne(id: string): Promise<AppConfigEntity> {
    const found = await this.appConfigRepository.findById(id);
    if (!found) throw new NotFoundException('Config not found');

    return found;
  }

  public async update(dto: UpdateAppConfigDto): Promise<AppConfigEntity> {
    const entity = await this.findOne(dto._id);

    if (!entity) throw new NotFoundException(`Config with id: ${dto._id} not found`);

    const updatedConfig = await this.appConfigRepository.save({
      ...entity,
      ...dto,
      _id: new ObjectId(dto._id),
    });

    if (updatedConfig.active) {
      this.cache = updatedConfig;
    }

    return updatedConfig;
  }

  public async remove(id: string): Promise<void> {
    const entity = await this.findOne(id);

    if (!entity) throw new NotFoundException(`Config with id: ${id} not found`);

    if (entity && entity.active) {
      throw new ConflictException('Cannot delete active config');
    }

    await this.appConfigRepository.remove(entity);
  }

  public async getActive(): Promise<AppConfigEntity> {
    if (this.cache) return this.cache;
    const activeConfig = await this.appConfigRepository.findActive();

    this.cache = activeConfig;

    return activeConfig;
  }

  public async manifest() {
    const activeConfig = await this.getActive();

    return activeConfig.manifest;
  }

  public async activate(id: string): Promise<void> {
    const isExists = await this.appConfigRepository.findById(id);

    if (!isExists) throw new NotFoundException('Config not found');

    if (isExists.active) return;

    await this.appConfigRepository.activateConfig(id);

    this.clearCache();
    this.getActive().then();

    return;
  }

  private clearCache() {
    this.cache = null;
  }
}
