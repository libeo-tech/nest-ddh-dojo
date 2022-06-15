import { Dragon } from '../../../domain/dragon.entity';
import { DragonNotFoundError } from '../../../domain/dragon.error';
import { DragonMockAdapter } from '../../../../infrastructure/mock/dragon.mock-adapter';
import { GetDragonByIdQuery } from './get-dragon-by-id.query';
import { GetDragonByIdQueryHandler } from './get-dragon-by-id.query-handler';
import { dragonEntityFactory } from '../../../domain/dragon.entity-factory';

describe('get dragon by id query', () => {
  const dragonMockAdapter = new DragonMockAdapter();
  const getDragonByIdQueryHandler = new GetDragonByIdQueryHandler(
    dragonMockAdapter,
  );

  beforeEach(() => {
    dragonMockAdapter.reset();
  });

  it('should get a dragon by Id', async () => {
    const smaug = await dragonMockAdapter.create(dragonEntityFactory());

    const result = await getDragonByIdQueryHandler.execute(
      new GetDragonByIdQuery({ dragonId: smaug.id }),
    );
    expect(result.isOk()).toBeTruthy();

    const { dragon } = result._unsafeUnwrap();
    expect(dragon).toMatchObject(smaug);
    dragonMockAdapter.delete(smaug.id);
  });

  it('should throw if the dragon does not exist', async () => {
    const missingDragonId = 'dragon-id-not-existing' as Dragon['id'];

    const result = await getDragonByIdQueryHandler.execute(
      new GetDragonByIdQuery({ dragonId: missingDragonId }),
    );
    expect(result.isErr()).toBeTruthy();
    expect(result._unsafeUnwrapErr()).toEqual(
      new DragonNotFoundError(missingDragonId),
    );
  });
});
