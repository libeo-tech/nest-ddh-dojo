import { DragonMockAdapter } from '../../../../infrastructure/mock/dragon.mock-adapter';
import { Dragon } from '../../../domain/dragon.entity';
import { dragonEntityFactory } from '../../../domain/dragon.entity-factory';
import { DragonNotFoundError } from '../../../domain/dragon.error';
import { RespawnDragonCommand } from './respawn-dragon.command';
import { RespawnDragonCommandHandler } from './respawn-dragon.command-handler';

describe('generate random dragon command', () => {
  const dragonMockAdapter = new DragonMockAdapter();
  const respawnDragonCommandHandler = new RespawnDragonCommandHandler(
    dragonMockAdapter,
  );

  beforeEach(() => {
    dragonMockAdapter.reset();
  });

  it('should respawn a given dragon if exists', async () => {
    const { id: dragonId } = await dragonMockAdapter.create(
      dragonEntityFactory({ currentHp: 0 }),
    );

    const result = await respawnDragonCommandHandler.execute(
      new RespawnDragonCommand({ dragonId }),
    );
    expect(result.isOk()).toBeTruthy();

    const dragon = await dragonMockAdapter.getById(dragonId);
    expect(dragon.currentHp).toBeGreaterThan(0);
  });

  it('should throw if the dragon does not exist', async () => {
    const missingDragonId = 'dragon-id-not-existing' as Dragon['id'];
    const respawnCommand = new RespawnDragonCommand({
      dragonId: missingDragonId,
    });

    const result = await respawnDragonCommandHandler.execute(respawnCommand);
    expect(result.isErr()).toBeTruthy();
    expect(result._unsafeUnwrapErr()).toEqual(
      new DragonNotFoundError(missingDragonId),
    );
  });
});
