import { eventBusMock } from '../../../../../common/utils/test/event-bus.mock';
import { Dragon } from '../../../domain/dragon.entity';
import { DragonNotFoundError } from '../../../domain/dragon.error';
import { DragonMockAdapter } from '../../../../infrastructure/mock/dragon.mock-adapter';
import { HurtDragonCommand } from './hurt-dragon.command';
import { HurtDragonCommandHandler } from './hurt-dragon.command-handler';
import { generateRandomNumber } from '../../../../../common/utils/random/random-number';
import { DragonSlainEvent } from '../../../domain/dragon.events';
import { HeroMockAdapter } from '../../../../../heroes/infrastructure/mock/hero.mock-adapter';
import { heroEntityFactory } from '../../../../../heroes/core/domain/hero.entity-factory';
import { dragonEntityFactory } from '../../../domain/dragon.entity-factory';

describe('hurt dragon command', () => {
  const dragonMockAdapter = new DragonMockAdapter();
  const heroMockAdapter = new HeroMockAdapter();
  const hurtDragonHandler = new HurtDragonCommandHandler(
    dragonMockAdapter,
    eventBusMock,
  );

  beforeEach(() => {
    dragonMockAdapter.reset();
    heroMockAdapter.reset();
  });

  it('should lose hp when hurt', async () => {
    const { id: heroId } = await heroMockAdapter.create(heroEntityFactory());
    const damage = { value: generateRandomNumber(1, 10), source: heroId };
    const { id: dragonId, currentHp: maxHp } = await dragonMockAdapter.create(
      dragonEntityFactory(),
    );
    const result = await hurtDragonHandler.execute(
      new HurtDragonCommand({ dragonId, damage }),
    );
    expect(result.isOk()).toBeTruthy();

    const dragon = await dragonMockAdapter.getById(dragonId);
    expect(dragon.currentHp).toStrictEqual(maxHp - damage.value);
  });

  it('should die when losing too much hp', async () => {
    const { id: heroId } = await heroMockAdapter.create(heroEntityFactory());
    const { id: dragonId, currentHp: maxHp } = await dragonMockAdapter.create(
      dragonEntityFactory(),
    );
    const damage = { value: maxHp + 1, source: heroId };
    const result = await hurtDragonHandler.execute(
      new HurtDragonCommand({ dragonId, damage }),
    );
    expect(result.isOk()).toBeTruthy();

    const dragon = await dragonMockAdapter.getById(dragonId);
    expect(dragon.currentHp).toStrictEqual(maxHp - damage.value);

    expect(eventBusMock.publish).toHaveBeenCalledWith(
      new DragonSlainEvent({ dragonId }),
    );
  });

  it('should throw if the dragon does not exist', async () => {
    const { id: heroId } = await heroMockAdapter.create(heroEntityFactory());
    const damage = { value: generateRandomNumber(1, 10), source: heroId };
    const missingDragonId = 'dragon-id-not-existing' as Dragon['id'];

    const result = await hurtDragonHandler.execute(
      new HurtDragonCommand({ dragonId: missingDragonId, damage }),
    );
    expect(result.isErr()).toBeTruthy();
    expect(result._unsafeUnwrapErr()).toEqual(
      new DragonNotFoundError(missingDragonId),
    );
  });
});
