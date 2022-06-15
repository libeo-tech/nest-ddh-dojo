import { Dragon } from '../../../domain/dragon.entity';
import { DragonNotFoundError } from '../../../domain/dragon.error';
import { DragonMockAdapter } from '../../../../infrastructure/mock/dragon.mock-adapter';
import { GetDragonAttackQuery } from './get-dragon-attack.query';
import { GetDragonAttackQueryHandler } from './get-dragon-attack.query-handler';
import { dragonEntityFactory } from '../../../domain/dragon.entity-factory';

describe('get dragon attack query', () => {
  const dragonMockAdapter = new DragonMockAdapter();
  const getDragonAttackQueryHandler = new GetDragonAttackQueryHandler(
    dragonMockAdapter,
  );

  beforeEach(() => {
    dragonMockAdapter.reset();
  });

  it('should get a dragon attack value by Id', async () => {
    const dragon = await dragonMockAdapter.create(dragonEntityFactory());

    const result = await getDragonAttackQueryHandler.execute(
      new GetDragonAttackQuery({ dragonId: dragon.id }),
    );
    expect(result.isOk()).toBeTruthy();

    const { attackValue } = result._unsafeUnwrap();
    expect(attackValue).toBeDefined();
    expect(attackValue).toBeGreaterThanOrEqual(0);
  });

  it('should throw if the dragon does not exist', async () => {
    const missingDragonId = 'dragon-id-not-existing' as Dragon['id'];

    const result = await getDragonAttackQueryHandler.execute(
      new GetDragonAttackQuery({ dragonId: missingDragonId }),
    );
    expect(result.isErr()).toBeTruthy();
    expect(result._unsafeUnwrapErr()).toEqual(
      new DragonNotFoundError(missingDragonId),
    );
  });
});
