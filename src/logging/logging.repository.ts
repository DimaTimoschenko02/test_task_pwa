import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { RequestLogEntity } from './entities/request-log.entity';

export interface LogsFindResult {
  items: RequestLogEntity[];
  total: number;
  page: number;
  limit: number;
}

@Injectable()
export class LoggingRepository {
  constructor(
    @InjectRepository(RequestLogEntity)
    private readonly repo: MongoRepository<RequestLogEntity>,
  ) {}

  public create(data: Partial<RequestLogEntity>): RequestLogEntity {
    return this.repo.create(data);
  }

  public async save(entity: RequestLogEntity): Promise<RequestLogEntity> {
    return this.repo.save(entity);
  }

  public async findWithFilters(query: {
    ip?: string;
    country?: string;
    os?: string;
    passed?: boolean;
    from?: Date;
    to?: Date;
    page: number;
    limit: number;
    order: 'asc' | 'desc';
  }): Promise<LogsFindResult> {
    const where: any = {};
    if (query.ip) where.ip = query.ip;
    if (query.country) where.country = query.country;
    if (query.os) where.os = query.os;
    if (typeof query.passed === 'boolean') where.passed = query.passed;
    if (query.from || query.to) {
      where.createdAt = {};
      if (query.from) where.createdAt.$gte = query.from;
      if (query.to) where.createdAt.$lte = query.to;
    }

    const skip = (query.page - 1) * query.limit;
    const take = query.limit;

    const [items, total] = await Promise.all([
      this.repo.find({
        where,
        order: { createdAt: query.order === 'asc' ? 'ASC' : 'DESC' },
        skip,
        take,
      }),
      this.repo.count({ where }),
    ]);

    return { items, total, page: query.page, limit: query.limit };
  }
}
