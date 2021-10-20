import { Hero } from '../../../domain/hero.entity';
import { HeroNotFoundError } from '../../../domain/hero.error';
import { HeroMockAdapter } from '../../ports/hero.mock-adapter';
import { LevelUpCommand } from './level-up.command';
import { LevelUpCommandHandler } from './level-up.command-handler';

describe('level up command', () => {
  const heroMockAdapter = new HeroMockAdapter();
  const levelUpHandler = new LevelUpCommandHandler(heroMockAdapter);

  it('should increase the level of a hero by 1', async () => {
    const { id: heroId, level } = await heroMockAdapter.addHero({});
    await levelUpHandler.execute(new LevelUpCommand({ heroId }));

    const { level: newLevel } = await heroMockAdapter.getHeroById(heroId);
    expect(newLevel).toEqual(level + 1);
    await heroMockAdapter.deleteHero(heroId);
  });

  it('should throw if the hero does not exist', async () => {
    const missingHeroId = 'hero-id-not-existing' as Hero['id'];

    await expect(
      levelUpHandler.execute(new LevelUpCommand({ heroId: missingHeroId })),
    ).rejects.toThrow(new HeroNotFoundError(missingHeroId));
  });
});
