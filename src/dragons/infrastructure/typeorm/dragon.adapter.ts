import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { withSpans } from '../../../common/utils/trace/honeycomb';
import { DragonPorts } from '../../core/application/ports/dragon.ports';
import { Dragon } from '../../core/domain/dragon.entity';
import { Dragon as DragonOrmEntity } from './dragon.orm-entity';
import { mapDragonOrmEntityToDragonEntity } from './dragon.orm-mapper';

@Injectable()
@withSpans()
export class DragonAdapter implements DragonPorts {
  constructor(
    @InjectRepository(DragonOrmEntity)
    private dragonsRepository: Repository<DragonOrmEntity>,
  ) {}

  async getById(dragonId: Dragon['id']): Promise<Dragon | undefined> {
    const dragon = await this.dragonsRepository.findOne(dragonId);
    return !!dragon ? mapDragonOrmEntityToDragonEntity(dragon) : undefined;
  }

  async getAll(): Promise<Dragon[]> {
    const dragons = await this.dragonsRepository.find();
    return dragons.map(mapDragonOrmEntityToDragonEntity);
  }

  async create(dragonProperties: Partial<Dragon>): Promise<Dragon> {
    const dragon = await this.dragonsRepository.save(dragonProperties);
    return mapDragonOrmEntityToDragonEntity(dragon);
  }

  async update(
    dragonId: Dragon['id'],
    dragonProperties: Partial<Dragon>,
  ): Promise<Dragon | undefined> {
    await this.dragonsRepository.update(dragonId, dragonProperties);
    const dragon = await this.dragonsRepository.findOne(dragonId);
    return !!dragon ? mapDragonOrmEntityToDragonEntity(dragon) : undefined;
  }

  async delete(dragonId: Dragon['id']): Promise<void> {
    await this.dragonsRepository.delete(dragonId);
  }
}
