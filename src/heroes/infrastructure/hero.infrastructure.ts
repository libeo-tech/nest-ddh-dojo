import { Hero } from '../core/domain/hero.entity';
import { Hero as HeroOrmEntity } from './typeorm/hero.orm-entity';
import { HeroAdapter } from './typeorm/heroes.adapter';

export const HeroInfrastructure = {
  providers: [{ provide: Hero, useClass: HeroAdapter }],
  repositories: [HeroOrmEntity],
};
