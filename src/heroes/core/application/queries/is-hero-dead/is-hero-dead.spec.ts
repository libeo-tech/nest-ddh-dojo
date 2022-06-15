import { Hero } from '../../../domain/hero.entity';
import { HeroNotFoundError } from '../../../domain/hero.error';
import { HeroMockAdapter } from '../../../../infrastructure/mock/hero.mock-adapter';
import { IsHeroDeadQueryHandler } from './is-hero-dead.query-handler';
import { IsHeroDeadQuery } from './is-hero-dead.query';
import { heroEntityFactory } from '../../../domain/hero.entity-factory';

describe('is hero dead query', () => {
  const heroMockAdapter = new HeroMockAdapter();
  const isHeroDeadQueryHandler = new IsHeroDeadQueryHandler(heroMockAdapter);

  beforeEach(() => {
    heroMockAdapter.reset();
  });

  it('should return false for a hero with more than 0 hp', async () => {
    const batman = await heroMockAdapter.create(heroEntityFactory());

    const result = await isHeroDeadQueryHandler.execute(
      new IsHeroDeadQuery({ heroId: batman.id }),
    );
    expect(result.isOk()).toBeTruthy();

    const { isDead } = result._unsafeUnwrap();
    expect(isDead).toStrictEqual(false);
  });

  it('should return true for a hero with less than 0 hp', async () => {
    const batman = await heroMockAdapter.create(
      heroEntityFactory({ currentHp: -1 }),
    );

    const result = await isHeroDeadQueryHandler.execute(
      new IsHeroDeadQuery({ heroId: batman.id }),
    );
    expect(result.isOk()).toBeTruthy();

    const { isDead } = result._unsafeUnwrap();
    expect(isDead).toStrictEqual(true);
  });

  it('should throw if the hero does not exist', async () => {
    const missingHeroId = 'hero-id-not-existing' as Hero['id'];

    const result = await isHeroDeadQueryHandler.execute(
      new IsHeroDeadQuery({ heroId: missingHeroId }),
    );
    expect(result.isErr()).toBeTruthy();
    expect(result._unsafeUnwrapErr()).toEqual(
      new HeroNotFoundError(missingHeroId),
    );
  });
});
