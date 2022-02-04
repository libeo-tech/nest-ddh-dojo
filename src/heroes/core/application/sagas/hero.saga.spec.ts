import { lastValueFrom, of } from 'rxjs';
import { Hero } from '../../domain/hero.entity';
import { HeroGainedXpEvent } from '../../domain/hero.events';
import { heroEntityFactory } from '../../domain/hero.entity-factory';
import { getXpNeededForNextLevel } from '../../domain/xp/xp.service';
import { LevelUpCommand } from '../commands/level-up/level-up.command';
import { HeroMockAdapter } from '../../../infrastructure/mock/hero.mock-adapter';
import { HeroSagas } from './hero.saga';

describe('hero saga', () => {
  const hero: Hero = heroEntityFactory();

  const heroMockAdapter = new HeroMockAdapter();
  const saga = new HeroSagas(heroMockAdapter);

  beforeEach(() => {
    heroMockAdapter.reset();
  });

  it('should trigger a level-up if hero has gained enough xp', async () => {
    heroMockAdapter.create(hero);
    const xpDelta = getXpNeededForNextLevel(hero.level) - hero.xp;
    heroMockAdapter.update(hero.id, { xp: hero.xp + xpDelta });

    const observable = saga.xpGain(
      of(new HeroGainedXpEvent({ heroId: hero.id })),
    );
    const result = await lastValueFrom(observable);
    expect(result).toEqual(new LevelUpCommand({ heroId: hero.id }));
  });

  it('should not trigger a level-up if hero does not have enough xp', async () => {
    heroMockAdapter.create(hero);
    heroMockAdapter.update(hero.id, { xp: 0 });

    const observable = saga.xpGain(
      of(new HeroGainedXpEvent({ heroId: hero.id })),
    );
    await expect(lastValueFrom(observable)).rejects.toThrow();
  });
});
