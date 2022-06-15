import { Dragon } from '../../../domain/dragon.entity';
import { DragonNotFoundError } from '../../../domain/dragon.error';
import { DragonMockAdapter } from '../../../../infrastructure/mock/dragon.mock-adapter';
import { IsDragonDeadQueryHandler } from './is-dragon-dead.query-handler';
import { IsDragonDeadQuery } from './is-dragon-dead.query';
import { dragonEntityFactory } from '../../../domain/dragon.entity-factory';

describe('is dragon dead query', () => {
  const dragonMockAdapter = new DragonMockAdapter();
  const isDragonDeadQueryHandler = new IsDragonDeadQueryHandler(
    dragonMockAdapter,
  );

  beforeEach(() => {
    dragonMockAdapter.reset();
  });

  it('should return false for a dragon with more than 0 hp', async () => {
    const dragon = await dragonMockAdapter.create(dragonEntityFactory());

    const result = await isDragonDeadQueryHandler.execute(
      new IsDragonDeadQuery({ dragonId: dragon.id }),
    );
    expect(result.isOk()).toBeTruthy();

    const { isDead } = result._unsafeUnwrap();
    expect(isDead).toStrictEqual(false);
  });

  it('should return true for a dragon with less than 0 hp', async () => {
    const dragon = await dragonMockAdapter.create(
      dragonEntityFactory({ currentHp: -1 }),
    );

    const result = await isDragonDeadQueryHandler.execute(
      new IsDragonDeadQuery({ dragonId: dragon.id }),
    );
    expect(result.isOk()).toBeTruthy();

    const { isDead } = result._unsafeUnwrap();
    expect(isDead).toStrictEqual(true);
  });

  it('should throw if the dragon does not exist', async () => {
    const missingDragonId = 'dragon-id-not-existing' as Dragon['id'];

    const result = await isDragonDeadQueryHandler.execute(
      new IsDragonDeadQuery({ dragonId: missingDragonId }),
    );
    expect(result.isErr()).toBeTruthy();
    expect(result._unsafeUnwrapErr()).toEqual(
      new DragonNotFoundError(missingDragonId),
    );
  });
});
