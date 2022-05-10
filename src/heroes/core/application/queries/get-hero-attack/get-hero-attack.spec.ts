import { Hero } from '../../../domain/hero.entity';
import { HeroNotFoundError } from '../../../domain/hero.error';
import { HeroMockAdapter } from '../../../../infrastructure/mock/hero.mock-adapter';
import { GetHeroAttackQuery } from './get-hero-attack.query';
import { GetHeroAttackQueryHandler } from './get-hero-attack.query-handler';

describe('get hero attack query', () => {
  const heroMockAdapter = new HeroMockAdapter();
  const getHeroAttackQueryHandler = new GetHeroAttackQueryHandler(
    heroMockAdapter,
  );

  beforeEach(() => {
    heroMockAdapter.reset();
  });

  it('should get a hero attack value by Id', async () => {
    const batman = await heroMockAdapter.create({});

    const result = await getHeroAttackQueryHandler.execute(
      new GetHeroAttackQuery({ heroId: batman.id }),
    );
    expect(result.isOk()).toBeTruthy();

    const { attackValue } = result._unsafeUnwrap();
    expect(attackValue).toBeDefined();
    expect(attackValue).toBeGreaterThan(0);
  });

  it('should throw if the hero does not exist', async () => {
    const missingHeroId = 'hero-id-not-existing' as Hero['id'];

    const result = await getHeroAttackQueryHandler.execute(
      new GetHeroAttackQuery({ heroId: missingHeroId }),
    );
    expect(result.isErr()).toBeTruthy();
    expect(result._unsafeUnwrapErr()).toEqual(
      new HeroNotFoundError(missingHeroId),
    );
  });
});
