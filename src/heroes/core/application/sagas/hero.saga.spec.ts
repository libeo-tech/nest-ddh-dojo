import { lastValueFrom, of } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { Dragon } from '../../../../dragons/core/domain/dragon.entity';
import { dragonEntityFactory } from '../../../../dragons/core/domain/dragon.entity-factory';
import { DragonSlainEvent } from '../../../../dragons/core/domain/dragon.events';
import { Hero } from '../../domain/hero.entity';
import { HeroGainedXpEvent } from '../../domain/hero.events';
import { heroFixtureFactory } from '../../domain/hero.fixture-factory';
import { getXpNeededForNextLevel } from '../../domain/xp/xp.service';
import { GainXpCommand } from '../commands/gain-xp/gain-xp.command';
import { LevelUpCommand } from '../commands/level-up/level-up.command';
import { HeroMockAdapter } from '../ports/hero.mock-adapter';
import { HeroSagas } from './hero.saga';

describe('hero saga', () => {
  let testScheduler: TestScheduler;
  const hero: Hero = heroFixtureFactory();
  const dragon: Dragon = dragonEntityFactory();

  const heroMockAdapter = new HeroMockAdapter();
  const saga = new HeroSagas(heroMockAdapter);

  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) =>
      expect(actual).toStrictEqual(expected),
    );
  });

  it('should trigger xp gain for hero that slays a dragon', () => {
    testScheduler.run(({ hot, expectObservable }) => {
      const events$ = hot('-s-s-|', {
        s: new DragonSlainEvent({ heroId: hero.id, dragon }),
      });

      const output$ = saga.dragonSlain(events$);
      expectObservable(output$).toBe('-x-x-|', {
        x: new GainXpCommand({ heroId: hero.id, xpDelta: 10 * dragon.level }),
      });
    });
  });

  it('should trigger a level-up if hero has gained enough xp', async () => {
    heroMockAdapter.addHero(hero);
    const xpDelta = getXpNeededForNextLevel(hero.level) - hero.xp;
    heroMockAdapter.updateHero(hero.id, { xp: hero.xp + xpDelta });

    const observable = saga.xpGain(
      of(new HeroGainedXpEvent({ heroId: hero.id })),
    );
    const result = await lastValueFrom(observable);
    expect(result).toEqual(new LevelUpCommand({ heroId: hero.id }));

    heroMockAdapter.deleteHero(hero.id);
  });

  it('should not trigger a level-up if hero does not have enough xp', async () => {
    heroMockAdapter.addHero(hero);
    heroMockAdapter.updateHero(hero.id, { xp: 0 });

    const observable = saga.xpGain(
      of(new HeroGainedXpEvent({ heroId: hero.id })),
    );
    await expect(lastValueFrom(observable)).rejects.toThrow();

    heroMockAdapter.deleteHero(hero.id);
  });
});
