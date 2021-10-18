import { HeroPorts } from '../core/application/ports/hero.ports';
import { Hero } from './heroes/hero.orm-entity';
import { HeroAdapter } from './heroes/heroes.adapter';

export const HeroInfrastructure = {
  providers: [{ provide: HeroPorts, useClass: HeroAdapter }],
  repositories: [Hero],
};
