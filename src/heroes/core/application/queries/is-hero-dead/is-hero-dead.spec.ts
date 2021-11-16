import { Hero } from '../../../domain/hero.entity';
import { HeroNotFoundError } from '../../../domain/hero.error';
import { HeroMockAdapter } from '../../../../infrastructure/mock/hero.mock-adapter';
import { IsHeroDeadQueryHandler } from './is-hero-dead.query-handler';
import { IsHeroDeadQuery } from './is-hero-dead.query';

describe('is hero dead query', () => {
  const heroMockAdapter = new HeroMockAdapter();
  const isHeroDeadQueryHandler = new IsHeroDeadQueryHandler(heroMockAdapter);

  it('should return false for a hero with more than 0 hp', async () => {
    const batman = await heroMockAdapter.create({});

    const { isDead } = await isHeroDeadQueryHandler.execute(
      new IsHeroDeadQuery({ heroId: batman.id }),
    );
    expect(isDead).toStrictEqual(false);
    heroMockAdapter.delete(batman.id);
  });

  it('should return true for a hero with less than 0 hp', async () => {
    const batman = await heroMockAdapter.create({ currentHp: -1 });

    const { isDead } = await isHeroDeadQueryHandler.execute(
      new IsHeroDeadQuery({ heroId: batman.id }),
    );
    expect(isDead).toStrictEqual(true);
    heroMockAdapter.delete(batman.id);
  });

  it('should throw if the hero does not exist', async () => {
    const missingHeroId = 'hero-id-not-existing' as Hero['id'];

    await expect(
      isHeroDeadQueryHandler.execute(
        new IsHeroDeadQuery({ heroId: missingHeroId }),
      ),
    ).rejects.toThrow(new HeroNotFoundError(missingHeroId));
  });
});
