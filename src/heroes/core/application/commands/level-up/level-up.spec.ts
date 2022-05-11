import { Hero } from '../../../domain/hero.entity';
import {
  HeroDoesNotHaveEnoughXp,
  HeroNotFoundError,
} from '../../../domain/hero.error';
import { getXpNeededForNextLevel } from '../../../domain/xp/xp.service';
import { HeroMockAdapter } from '../../../../infrastructure/mock/hero.mock-adapter';
import { LevelUpCommand } from './level-up.command';
import { LevelUpCommandHandler } from './level-up.command-handler';

describe('level up command', () => {
  const heroMockAdapter = new HeroMockAdapter();
  const levelUpHandler = new LevelUpCommandHandler(heroMockAdapter);

  beforeEach(() => {
    heroMockAdapter.reset();
  });

  it('should increase the level of a hero by 1 for a hero with enough xp', async () => {
    const { id: heroId, level } = await heroMockAdapter.create({});
    const xpNeeded = getXpNeededForNextLevel(level);
    await heroMockAdapter.update(heroId, {
      xp: xpNeeded + 1,
    });

    const result = await levelUpHandler.execute(new LevelUpCommand({ heroId }));

    expect(result.isOk()).toBeTruthy();
    const { level: newLevel } = await heroMockAdapter.getById(heroId);
    expect(newLevel).toEqual(level + 1);
  });

  it('should throw if the hero does not have enough xp', async () => {
    const { id: heroId } = await heroMockAdapter.create({});
    await heroMockAdapter.update(heroId, {
      xp: 0,
    });

    const result = await levelUpHandler.execute(new LevelUpCommand({ heroId }));
    expect(result.isErr()).toBeTruthy();
    expect(result._unsafeUnwrapErr()).toEqual(
      new HeroDoesNotHaveEnoughXp(heroId),
    );
  });

  it('should throw if the hero does not exist', async () => {
    const missingHeroId = 'hero-id-not-existing' as Hero['id'];

    const result = await levelUpHandler.execute(
      new LevelUpCommand({ heroId: missingHeroId }),
    );
    expect(result.isErr()).toBeTruthy();
    expect(result._unsafeUnwrapErr()).toEqual(
      new HeroNotFoundError(missingHeroId),
    );
  });
});
