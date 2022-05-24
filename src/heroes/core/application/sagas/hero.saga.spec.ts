import { lastValueFrom, of } from 'rxjs';
import { HeroGainedXpEvent } from '../../domain/hero.events';
import { getXpNeededForNextLevel } from '../../domain/xp/xp.service';
import { LevelUpCommand } from '../commands/level-up/level-up.command';
import { HeroMockAdapter } from '../../../infrastructure/mock/hero.mock-adapter';
import { HeroSagas } from './hero.saga';

describe('hero saga', () => {
  const heroMockAdapter = new HeroMockAdapter();
  const saga = new HeroSagas(heroMockAdapter);

  beforeEach(() => {
    heroMockAdapter.reset();
  });

  it('should trigger a level-up if hero has gained enough xp', async () => {
    const hero = await heroMockAdapter.create({});
    const xpDelta = getXpNeededForNextLevel(hero.level) - hero.xp;
    heroMockAdapter.update(hero.id, { xp: hero.xp + xpDelta });

    const observable = saga.xpGain(
      of(new HeroGainedXpEvent({ heroId: hero.id })),
    );
    const result = await lastValueFrom(observable);
    expect(result).toEqual(new LevelUpCommand({ heroId: hero.id }));
  });

  it('should not trigger a level-up if hero does not have enough xp', async () => {
    const hero = await heroMockAdapter.create({});
    heroMockAdapter.update(hero.id, { xp: 0 });

    const observable = saga.xpGain(
      of(new HeroGainedXpEvent({ heroId: hero.id })),
    );
    await expect(lastValueFrom(observable)).rejects.toThrow();
  });
});
