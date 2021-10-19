import { Hero } from '../../domain/hero.entity';
import { heroFixtureFactory } from '../../domain/hero.fixture-factory';

export const heroMockAdapter = {
  heroes: {},
  getHeroes(): Promise<Hero[]> {
    return Promise.resolve(this.heroes);
  },
  getHeroById(heroId: Hero['id']): Promise<Hero> {
    return Promise.resolve(this.heroes[heroId]);
  },
  addHero(heroProperties: Partial<Hero>): Promise<Hero> {
    const newHero = heroFixtureFactory(heroProperties);
    this.heroes[newHero.id] = newHero;
    return Promise.resolve(newHero);
  },
  updateHero(heroId: Hero['id'], heroProperties: Partial<Hero>): Promise<Hero> {
    this.heroes[heroId] = { ...this.heroes[heroId], ...heroProperties };
    return this.heroes[heroId];
  },
  deleteHero(heroId: Hero['id']): Promise<void> {
    delete this.heroes[heroId];
    return Promise.resolve();
  },
};
