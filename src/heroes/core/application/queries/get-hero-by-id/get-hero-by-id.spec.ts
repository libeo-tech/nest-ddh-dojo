import { Hero } from '../../../domain/hero.entity';
import { HeroNotFoundError } from '../../../domain/hero.error';
import { HeroMockAdapter } from '../../../../infrastructure/mock/hero.mock-adapter';
import { GetHeroByIdQuery } from './get-hero-by-id.query';
import { GetHeroByIdQueryHandler } from './get-hero-by-id.query-handler';

describe('get hero by id query', () => {
  const heroMockAdapter = new HeroMockAdapter();
  const getHeroByIdQueryHandler = new GetHeroByIdQueryHandler(heroMockAdapter);

  beforeEach(() => {
    heroMockAdapter.reset();
  });

  it('should get a hero by Id', async () => {
    const batman = await heroMockAdapter.create({});

    const result = await getHeroByIdQueryHandler.execute(
      new GetHeroByIdQuery({ heroId: batman.id }),
    );
    expect(result.isOk()).toBeTruthy();

    const { hero } = result._unsafeUnwrap();
    expect(hero).toMatchObject(batman);
  });

  it('should throw if the hero does not exist', async () => {
    const missingHeroId = 'hero-id-not-existing' as Hero['id'];

    const result = await getHeroByIdQueryHandler.execute(
      new GetHeroByIdQuery({ heroId: missingHeroId }),
    );
    expect(result.isErr()).toBeTruthy();
    expect(result._unsafeUnwrapErr()).toEqual(
      new HeroNotFoundError(missingHeroId),
    );
  });
});
