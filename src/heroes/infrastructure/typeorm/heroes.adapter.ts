import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { BaseOrmAdapter } from '../../../common/infrastructure/base.orm-adapter';
import { Hero } from '../../core/domain/hero.entity';
import { Hero as HeroOrmEntity } from './hero.orm-entity';
import { mapHeroOrmEntityToHeroEntity } from './hero.orm-mapper';

@Injectable()
export class HeroAdapter extends BaseOrmAdapter<Hero, HeroOrmEntity> {
  mapOrmEntityToEntity = mapHeroOrmEntityToHeroEntity;
  mapEntityPropertiesToOrmEntityProperties = (
    entityProperties: Partial<Hero>,
  ): DeepPartial<HeroOrmEntity> => entityProperties;
  entitiesRepository = this.heroesRepository;
  constructor(
    @InjectRepository(HeroOrmEntity)
    private heroesRepository: Repository<HeroOrmEntity>,
  ) {
    super();
  }
}
