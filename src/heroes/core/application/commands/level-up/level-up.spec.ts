import { Hero } from '../../../domain/hero.entity';
import {
  HeroDoesNotHaveEnoughXp,
  HeroNotFoundError,
} from '../../../domain/hero.error';
import { getXpNeededForNextLevel } from '../../../domain/xp/xp.service';
import { HeroMockAdapter } from '../../ports/hero.mock-adapter';
import { LevelUpCommand } from './level-up.command';
import { LevelUpCommandHandler } from './level-up.command-handler';

describe('level up command', () => {
  const heroMockAdapter = new HeroMockAdapter();
  const levelUpHandler = new LevelUpCommandHandler(heroMockAdapter);

  it('should increase the level of a hero by 1 for a hero with enough xp', async () => {
    const { id: heroId, level } = await heroMockAdapter.addHero({});
    const xpNeeded = getXpNeededForNextLevel(level);
    await heroMockAdapter.updateHero(heroId, {
      xp: xpNeeded + 1,
    });

    await levelUpHandler.execute(new LevelUpCommand({ heroId }));

    const { level: newLevel } = await heroMockAdapter.getHeroById(heroId);
    expect(newLevel).toEqual(level + 1);
    await heroMockAdapter.deleteHero(heroId);
  });

  it('should throw if the hero does not have enough xp', async () => {
    const { id: heroId } = await heroMockAdapter.addHero({});
    await heroMockAdapter.updateHero(heroId, {
      xp: 0,
    });

    await expect(
      levelUpHandler.execute(new LevelUpCommand({ heroId })),
    ).rejects.toThrow(new HeroDoesNotHaveEnoughXp(heroId));
    await heroMockAdapter.deleteHero(heroId);
  });

  it('should throw if the hero does not exist', async () => {
    const missingHeroId = 'hero-id-not-existing' as Hero['id'];

    await expect(
      levelUpHandler.execute(new LevelUpCommand({ heroId: missingHeroId })),
    ).rejects.toThrow(new HeroNotFoundError(missingHeroId));
  });
});
