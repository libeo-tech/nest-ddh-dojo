import { Hero } from '../../../domain/hero.entity';
import { HeroNotFoundError } from '../../../domain/hero.error';
import { HeroMockAdapter } from '../../../../infrastructure/mock/hero.mock-adapter';
import { HealHeroCommand } from './heal-hero.command';
import { HealHeroCommandHandler } from './heal-hero.command-handler';
import { generateRandomNumber } from '../../../../../common/utils/random/random-number';
import { heroEntityFactory } from '../../../domain/hero.entity-factory';

describe('heal hero command', () => {
  const heroMockAdapter = new HeroMockAdapter();
  const healHeroCommandHandler = new HealHeroCommandHandler(heroMockAdapter);

  beforeEach(() => {
    heroMockAdapter.reset();
  });

  it('should gain hp when heal for an injured hero', async () => {
    const { id: heroId, currentHp } = await heroMockAdapter.create(
      heroEntityFactory({
        currentHp: 1,
      }),
    );
    const heal = generateRandomNumber(1, 5);
    const result = await healHeroCommandHandler.execute(
      new HealHeroCommand({ heroId, heal }),
    );
    expect(result.isOk()).toBeTruthy();

    const hero = await heroMockAdapter.getById(heroId);
    expect(hero.currentHp).toStrictEqual(currentHp + heal);
  });

  it('should not heal an uninjured hero', async () => {
    const { id: heroId, currentHp: maxHp } = await heroMockAdapter.create(
      heroEntityFactory(),
    );
    const heal = generateRandomNumber(1, 5);
    const result = await healHeroCommandHandler.execute(
      new HealHeroCommand({ heroId, heal }),
    );
    expect(result.isOk()).toBeTruthy();

    const hero = await heroMockAdapter.getById(heroId);
    expect(hero.currentHp).toStrictEqual(maxHp);
  });

  it('should throw if the Hero does not exist', async () => {
    const heal = generateRandomNumber(1, 10);
    const missingHeroId = 'Hero-id-not-existing' as Hero['id'];

    const result = await healHeroCommandHandler.execute(
      new HealHeroCommand({ heroId: missingHeroId, heal }),
    );
    expect(result.isErr()).toBeTruthy();
    expect(result._unsafeUnwrapErr()).toEqual(
      new HeroNotFoundError(missingHeroId),
    );
  });
});
