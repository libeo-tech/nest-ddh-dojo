import { eventBusMock } from '../../../../../common/utils/test/event-bus.mock';
import { Dragon } from '../../../domain/dragon.entity';
import { DragonNotFoundError } from '../../../domain/dragon.error';
import { DragonMockAdapter } from '../../../../infrastructure/mock/dragon.mock-adapter';
import { HurtDragonCommand } from './hurt-dragon.command';
import { HurtDragonCommandHandler } from './hurt-dragon.command-handler';
import { generateRandomNumber } from '../../../../../common/utils/random/random-number';
import { heroEntityFactory } from '../../../../../heroes/core/domain/hero.entity-factory';

describe('hurt dragon command', () => {
  const { id: heroId } = heroEntityFactory();
  const dragonMockAdapter = new DragonMockAdapter();
  const attackHandler = new HurtDragonCommandHandler(dragonMockAdapter);

  it('should lose hp when hurt', async () => {
    const damage = { value: generateRandomNumber(1, 10), source: heroId };
    const { id: dragonId, currentHp: maxHp } = await dragonMockAdapter.create(
      {},
    );
    await attackHandler.execute(new HurtDragonCommand({ dragonId, damage }));

    const dragon = await dragonMockAdapter.getById(dragonId);
    expect(dragon.currentHp).toStrictEqual(maxHp - damage.value);

    dragonMockAdapter.delete(dragonId);
  });

  it('should die when losing too much hp', async () => {
    const { id: dragonId, currentHp: maxHp } = await dragonMockAdapter.create(
      {},
    );
    const damage = { value: maxHp + 1, source: heroId };
    await attackHandler.execute(new HurtDragonCommand({ dragonId, damage }));

    const dragon = await dragonMockAdapter.getById(dragonId);
    expect(dragon.currentHp).toStrictEqual(maxHp - damage.value);

    dragonMockAdapter.delete(dragonId);
  });

  it('should throw if the dragon does not exist', async () => {
    const damage = { value: generateRandomNumber(1, 10), source: heroId };
    const missingDragonId = 'dragon-id-not-existing' as Dragon['id'];

    await expect(
      attackHandler.execute(
        new HurtDragonCommand({ dragonId: missingDragonId, damage }),
      ),
    ).rejects.toThrow(new DragonNotFoundError(missingDragonId));
  });
});
