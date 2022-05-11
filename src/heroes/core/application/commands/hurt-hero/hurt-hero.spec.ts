import { Hero } from '../../../domain/hero.entity';
import { HeroNotFoundError } from '../../../domain/hero.error';
import { HeroMockAdapter } from '../../../../infrastructure/mock/hero.mock-adapter';
import { HurtHeroCommand } from './hurt-hero.command';
import { HurtHeroCommandHandler } from './hurt-hero.command-handler';
import { generateRandomNumber } from '../../../../../common/utils/random/random-number';
import { dragonEntityFactory } from '../../../../../dragons/core/domain/dragon.entity-factory';

describe('hurt hero command', () => {
  const { id: dragonId } = dragonEntityFactory();
  const heroMockAdapter = new HeroMockAdapter();
  const hurtHeroHandler = new HurtHeroCommandHandler(heroMockAdapter);

  beforeEach(() => {
    heroMockAdapter.reset();
  });

  it('should lose hp when hurt', async () => {
    const { id: heroId, currentHp: maxHp } = await heroMockAdapter.create({});
    const damage = {
      value: generateRandomNumber(1, maxHp - 1),
      source: dragonId,
    };
    const result = await hurtHeroHandler.execute(
      new HurtHeroCommand({ heroId, damage }),
    );
    expect(result.isOk()).toBeTruthy();

    const hero = await heroMockAdapter.getById(heroId);
    expect(hero.currentHp).toStrictEqual(maxHp - damage.value);
  });

  it('should die when losing too much hp', async () => {
    const { id: heroId, currentHp: maxHp } = await heroMockAdapter.create({});
    const damage = { value: maxHp + 1, source: dragonId };
    const result = await hurtHeroHandler.execute(
      new HurtHeroCommand({ heroId, damage }),
    );
    expect(result.isOk()).toBeTruthy();

    const hero = await heroMockAdapter.getById(heroId);
    expect(hero.currentHp).toStrictEqual(maxHp - damage.value);
  });

  it('should throw if the Hero does not exist', async () => {
    const damage = { value: generateRandomNumber(1, 10), source: dragonId };
    const missingHeroId = 'Hero-id-not-existing' as Hero['id'];

    const result = await hurtHeroHandler.execute(
      new HurtHeroCommand({ heroId: missingHeroId, damage }),
    );
    expect(result.isErr()).toBeTruthy();
    expect(result._unsafeUnwrapErr()).toEqual(
      new HeroNotFoundError(missingHeroId),
    );
  });
});
