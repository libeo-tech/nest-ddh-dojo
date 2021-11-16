import { Hero } from '../../../domain/Hero.entity';
import { HeroNotFoundError } from '../../../domain/Hero.error';
import { HeroMockAdapter } from '../../../../infrastructure/mock/Hero.mock-adapter';
import { HealHeroCommand } from './heal-hero.command';
import { HealHeroCommandHandler } from './heal-hero.command-handler';
import { generateRandomNumber } from '../../../../../common/utils/random/random-number';

describe('heal hero command', () => {
  const heroMockAdapter = new HeroMockAdapter();
  const healHeroCommandHandler = new HealHeroCommandHandler(heroMockAdapter);

  it('should gain hp when heal for an injured hero', async () => {
    const { id: heroId, currentHp } = await heroMockAdapter.create({
      currentHp: 1,
    });
    const heal = generateRandomNumber(1, 5);
    await healHeroCommandHandler.execute(new HealHeroCommand({ heroId, heal }));

    const hero = await heroMockAdapter.getById(heroId);
    expect(hero.currentHp).toStrictEqual(currentHp + heal);

    heroMockAdapter.delete(heroId);
  });

  it('should not heal an uninjured hero', async () => {
    const { id: heroId, currentHp: maxHp } = await heroMockAdapter.create({});
    const heal = generateRandomNumber(1, 5);
    await healHeroCommandHandler.execute(new HealHeroCommand({ heroId, heal }));

    const hero = await heroMockAdapter.getById(heroId);
    expect(hero.currentHp).toStrictEqual(maxHp);

    heroMockAdapter.delete(heroId);
  });

  it('should throw if the Hero does not exist', async () => {
    const heal = generateRandomNumber(1, 10);
    const missingHeroId = 'Hero-id-not-existing' as Hero['id'];

    await expect(
      healHeroCommandHandler.execute(
        new HealHeroCommand({ heroId: missingHeroId, heal }),
      ),
    ).rejects.toThrow(new HeroNotFoundError(missingHeroId));
  });
});
