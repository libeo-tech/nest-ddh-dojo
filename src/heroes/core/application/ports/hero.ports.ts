import { Hero } from '../../domain/hero.entity';

export abstract class HeroPorts {
  abstract getHeroes(): Promise<Hero[]>;
  abstract getHeroById(heroId: Hero['id']): Promise<Hero>;
  abstract addHero(heroProperties: Partial<Hero>): Promise<Hero>;
  abstract updateHero(
    heroId: Hero['id'],
    heroProperties: Partial<Hero>,
  ): Promise<Hero>;
  abstract deleteHero(heroId: Hero['id']): Promise<void>;
}
