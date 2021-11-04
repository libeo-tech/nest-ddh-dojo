import { HeroPorts } from '../core/application/ports/hero.ports';
import { Hero } from './typeorm/hero.orm-entity';
import { HeroAdapter } from './typeorm/heroes.adapter';

export const HeroInfrastructure = {
  providers: [{ provide: HeroPorts, useClass: HeroAdapter }],
  repositories: [Hero],
};
