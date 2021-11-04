import { Hero } from '../../../domain/hero.entity';
import { HeroNotFoundError } from '../../../domain/hero.error';
import { HeroMockAdapter } from '../../../../infrastructure/mock/hero.mock-adapter';
import { GetHeroByIdQuery } from './get-hero-by-id.query';
import { GetHeroByIdQueryHandler } from './get-hero-by-id.query-handler';

describe('get all hero query', () => {
  const heroMockAdapter = new HeroMockAdapter();
  const getHeroByIdQueryHandler = new GetHeroByIdQueryHandler(heroMockAdapter);

  it('should get a hero by Id', async () => {
    const batman = await heroMockAdapter.create({});

    const { hero } = await getHeroByIdQueryHandler.execute(
      new GetHeroByIdQuery({ heroId: batman.id }),
    );
    expect(hero).toMatchObject(batman);
    heroMockAdapter.delete(batman.id);
  });

  it('should throw if the hero does not exist', async () => {
    const missingHeroId = 'hero-id-not-existing' as Hero['id'];

    await expect(
      getHeroByIdQueryHandler.execute(
        new GetHeroByIdQuery({ heroId: missingHeroId }),
      ),
    ).rejects.toThrow(new HeroNotFoundError(missingHeroId));
  });
});
