import { HeroMockAdapter } from '../../ports/hero.mock-adapter';
import { GetHeroByIdQuery } from './get-hero-by-id.query';
import { GetHeroByIdQueryHandler } from './get-hero-by-id.query-handler';

describe('get all hero query', () => {
  const heroMockAdapter = new HeroMockAdapter();
  const getHeroByIdQueryHandler = new GetHeroByIdQueryHandler(heroMockAdapter);

  it('should get a hero by Id', async () => {
    const batman = await heroMockAdapter.addHero({});
    const query = new GetHeroByIdQuery({ heroId: batman.id });

    const { hero } = await getHeroByIdQueryHandler.execute(query);
    expect(hero).toMatchObject(batman);
    heroMockAdapter.deleteHero(batman.id);
  });
});
