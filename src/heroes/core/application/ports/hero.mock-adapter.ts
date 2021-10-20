import { Hero } from '../../domain/hero.entity';
import { heroFixtureFactory } from '../../domain/hero.fixture-factory';
import { HeroPorts } from './hero.ports';

export class HeroMockAdapter implements HeroPorts {
  heroes: Record<Hero['id'], Hero> = {} as Record<Hero['id'], Hero>;
  getHeroes(): Promise<Hero[]> {
    return Promise.resolve(Object.values(this.heroes));
  }
  getHeroById(heroId: Hero['id']): Promise<Hero> {
    return Promise.resolve(this.heroes[heroId]);
  }
  addHero(heroProperties: Partial<Hero>): Promise<Hero> {
    const newHero = heroFixtureFactory(heroProperties);
    this.heroes[newHero.id] = newHero;
    return Promise.resolve(newHero);
  }
  updateHero(heroId: Hero['id'], heroProperties: Partial<Hero>): Promise<Hero> {
    this.heroes[heroId] = { ...this.heroes[heroId], ...heroProperties };
    return Promise.resolve(this.heroes[heroId]);
  }
  deleteHero(heroId: Hero['id']): Promise<void> {
    delete this.heroes[heroId];
    return Promise.resolve();
  }
}
