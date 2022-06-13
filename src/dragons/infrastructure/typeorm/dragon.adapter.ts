import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { BaseOrmAdapter } from '../../../common/infrastructure/typeorm/base.orm-adapter';
import { Dragon } from '../../core/domain/dragon.entity';
import { Dragon as DragonOrmEntity } from './dragon.orm-entity';
import { mapDragonOrmEntityToDragonEntity } from './dragon.orm-mapper';

@Injectable()
export class DragonAdapter extends BaseOrmAdapter<Dragon, DragonOrmEntity> {
  mapOrmEntityToEntity = mapDragonOrmEntityToDragonEntity;
  mapEntityPropertiesToOrmEntityProperties = (
    entityProperties: Partial<Dragon>,
  ): DeepPartial<DragonOrmEntity> => entityProperties;
  entitiesRepository = this.dragonsRepository;
  constructor(
    @InjectRepository(DragonOrmEntity)
    private dragonsRepository: Repository<DragonOrmEntity>,
  ) {
    super();
  }
}
