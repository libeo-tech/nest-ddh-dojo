import { eventBusMock } from '../../../../../common/utils/test/event-bus.mock';
import { Dragon } from '../../../domain/dragon.entity';
import { DragonNotFoundError } from '../../../domain/dragon.error';
import { DragonMockAdapter } from '../../../../infrastructure/mock/dragon.mock-adapter';
import { HurtDragonCommand } from './hurt-dragon.command';
import { HurtDragonCommandHandler } from './hurt-dragon.command-handler';
import { generateRandomNumber } from '../../../../../common/utils/random/random-number';

describe('hurt command', () => {
  const dragonMockAdapter = new DragonMockAdapter();
  const attackHandler = new HurtDragonCommandHandler(
    dragonMockAdapter,
    eventBusMock,
  );

  it('should lose hp when hurt', async () => {
    const damage = generateRandomNumber(1, 10);
    const { id: dragonId, currentHp: maxHp } = await dragonMockAdapter.create(
      {},
    );
    await attackHandler.execute(new HurtDragonCommand({ dragonId, damage }));

    const dragon = await dragonMockAdapter.getById(dragonId);
    expect(dragon.currentHp).toStrictEqual(maxHp - damage);
    expect(eventBusMock.publish).toHaveBeenCalled();
  });

  it('should throw if the dragon does not exist', async () => {
    const damage = generateRandomNumber(1, 10);
    const missingDragonId = 'dragon-id-not-existing' as Dragon['id'];

    await expect(
      attackHandler.execute(
        new HurtDragonCommand({ dragonId: missingDragonId, damage }),
      ),
    ).rejects.toThrow(new DragonNotFoundError(missingDragonId));
  });
});
