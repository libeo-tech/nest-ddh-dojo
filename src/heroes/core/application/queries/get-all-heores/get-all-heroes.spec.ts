import { HeroMockAdapter } from '../../../../infrastructure/mock/hero.mock-adapter';
import { GetAllHeroesQueryHandler } from './get-all-heroes.query-handler';

describe('get all heroes query', () => {
  const heroMockAdapter = new HeroMockAdapter();
  const getAllHeroesQueryHandler = new GetAllHeroesQueryHandler(
    heroMockAdapter,
  );

  it('should return all heroes', async () => {
    const [hero1, hero2] = await Promise.all([
      heroMockAdapter.create({}),
      heroMockAdapter.create({}),
    ]);

    const { heroes } = await getAllHeroesQueryHandler.execute();
    expect(heroes.length).toBe(2);
    expect(heroes[0]).toMatchObject(hero1);
    expect(heroes[1]).toMatchObject(hero2);
  });
});
