import { eventBusMock } from '../../../../../common/utils/test/event-bus.mock';
import { Hero } from '../../../domain/Hero.entity';
import { HeroNotFoundError } from '../../../domain/Hero.error';
import { HeroMockAdapter } from '../../../../infrastructure/mock/Hero.mock-adapter';
import { HurtHeroCommand } from './hurt-hero.command';
import { HurtHeroCommandHandler } from './hurt-hero.command-handler';
import { generateRandomNumber } from '../../../../../common/utils/random/random-number';
import { dragonEntityFactory } from '../../../../../dragons/core/domain/dragon.entity-factory';
import { HeroDiedEvent, HeroGotHurtEvent } from '../../../domain/hero.events';

describe('hurt hero command', () => {
  const { id: dragonId } = dragonEntityFactory();
  const heroMockAdapter = new HeroMockAdapter();
  const hurtHeroHandler = new HurtHeroCommandHandler(
    heroMockAdapter,
    eventBusMock,
  );

  it('should lose hp when hurt', async () => {
    const { id: heroId, currentHp: maxHp } = await heroMockAdapter.create({});
    const damage = {
      value: generateRandomNumber(1, maxHp - 1),
      source: dragonId,
    };
    await hurtHeroHandler.execute(new HurtHeroCommand({ heroId, damage }));

    const hero = await heroMockAdapter.getById(heroId);
    expect(hero.currentHp).toStrictEqual(maxHp - damage.value);
    expect(eventBusMock.publish).toHaveBeenCalledWith(
      new HeroGotHurtEvent({ heroId, damage }),
    );

    heroMockAdapter.delete(heroId);
  });

  it('should die when losing too much hp', async () => {
    const { id: heroId, currentHp: maxHp } = await heroMockAdapter.create({});
    const damage = { value: maxHp + 1, source: dragonId };
    await hurtHeroHandler.execute(new HurtHeroCommand({ heroId, damage }));

    const hero = await heroMockAdapter.getById(heroId);
    expect(hero.currentHp).toStrictEqual(maxHp - damage.value);
    expect(eventBusMock.publish).toHaveBeenCalledWith(
      new HeroDiedEvent({ heroId, source: dragonId }),
    );

    heroMockAdapter.delete(heroId);
  });

  it('should throw if the Hero does not exist', async () => {
    const damage = { value: generateRandomNumber(1, 10), source: dragonId };
    const missingHeroId = 'Hero-id-not-existing' as Hero['id'];

    await expect(
      hurtHeroHandler.execute(
        new HurtHeroCommand({ heroId: missingHeroId, damage }),
      ),
    ).rejects.toThrow(new HeroNotFoundError(missingHeroId));
  });
});
