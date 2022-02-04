import { Dragon } from '../../../domain/dragon.entity';
import { DragonNotFoundError } from '../../../domain/dragon.error';
import { DragonMockAdapter } from '../../../../infrastructure/mock/dragon.mock-adapter';
import { GetDragonAttackQuery } from './get-dragon-attack.query';
import { GetDragonAttackQueryHandler } from './get-dragon-attack.query-handler';

describe('get dragon attack query', () => {
  const dragonMockAdapter = new DragonMockAdapter();
  const getDragonAttackQueryHandler = new GetDragonAttackQueryHandler(
    dragonMockAdapter,
  );

  beforeEach(() => {
    dragonMockAdapter.reset();
  });

  it('should get a dragon attack value by Id', async () => {
    const dragon = await dragonMockAdapter.create({});

    const { attackValue } = await getDragonAttackQueryHandler.execute(
      new GetDragonAttackQuery({ dragonId: dragon.id }),
    );
    expect(attackValue).toBeDefined();
    expect(attackValue).toBeGreaterThanOrEqual(0);
  });

  it('should throw if the dragon does not exist', async () => {
    const missingDragonId = 'dragon-id-not-existing' as Dragon['id'];

    await expect(
      getDragonAttackQueryHandler.execute(
        new GetDragonAttackQuery({ dragonId: missingDragonId }),
      ),
    ).rejects.toThrow(new DragonNotFoundError(missingDragonId));
  });
});
