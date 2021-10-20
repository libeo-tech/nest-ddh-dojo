import { eventBusMock } from '../../../../../common/utils/test/event-bus.mock';
import { heroFixtureFactory } from '../../../../../heroes/core/domain/hero.fixture-factory';
import { Dragon } from '../../../domain/dragon.entity';
import { DragonNotFoundError } from '../../../domain/dragon.error';
import { DragonMockAdapter } from '../../ports/dragon.mock-adapter';
import { SlayDragonCommand } from './slay-dragon.command';
import { SlayDragonCommandHandler } from './slay-dragon.command-handler';

describe('slay dragon command', () => {
  const { id: heroId } = heroFixtureFactory();
  const dragonMockAdapter = new DragonMockAdapter();
  const slayDragonHandler = new SlayDragonCommandHandler(
    dragonMockAdapter,
    eventBusMock,
  );

  it('should delete the dragon if it exists', async () => {
    const { id: dragonId } = await dragonMockAdapter.createDragon({});
    await slayDragonHandler.execute(
      new SlayDragonCommand({ dragonId, heroId }),
    );

    const dragon = await dragonMockAdapter.getDragonById(dragonId);
    expect(dragon).not.toBeDefined();
  });

  it('should throw if the dragon does not exist', async () => {
    const missingDragonId = 'dragon-id-not-existing' as Dragon['id'];

    await expect(
      slayDragonHandler.execute(
        new SlayDragonCommand({ dragonId: missingDragonId, heroId }),
      ),
    ).rejects.toThrow(new DragonNotFoundError(missingDragonId));
  });
});
