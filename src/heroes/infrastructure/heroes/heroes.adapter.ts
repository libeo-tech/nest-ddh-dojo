import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { withSpans } from '../../../common/utils/trace/honeycomb';
import { HeroPorts } from '../../core/application/ports/hero.ports';
import { Hero } from '../../core/domain/hero.entity';
import { Hero as HeroOrmEntity } from './hero.orm-entity';
import { mapHeroOrmEntityToHeroEntity } from './hero.orm-mapper';

@Injectable()
@withSpans()
export class HeroAdapter implements HeroPorts {
  constructor(
    @InjectRepository(HeroOrmEntity)
    private heroesRepository: Repository<HeroOrmEntity>,
  ) {}
  async getHeroById(heroId: Hero['id']): Promise<Hero> {
    const hero = await this.heroesRepository.findOne(heroId);
    return mapHeroOrmEntityToHeroEntity(hero);
  }

  async getHeroes(): Promise<Hero[]> {
    const heroes = await this.heroesRepository.find();
    return heroes.map(mapHeroOrmEntityToHeroEntity);
  }

  async addHero(heroProperties: Partial<Hero>): Promise<Hero> {
    const hero = await this.heroesRepository.save(heroProperties);
    return mapHeroOrmEntityToHeroEntity(hero);
  }

  async updateHero(
    heroId: Hero['id'],
    heroProperties: Partial<Hero>,
  ): Promise<Hero> {
    await this.heroesRepository.update(heroId, heroProperties);
    const hero = await this.heroesRepository.findOne(heroId);
    return mapHeroOrmEntityToHeroEntity(hero);
  }

  async deleteHero(heroId: Hero['id']): Promise<void> {
    await this.heroesRepository.delete(heroId);
  }
}
