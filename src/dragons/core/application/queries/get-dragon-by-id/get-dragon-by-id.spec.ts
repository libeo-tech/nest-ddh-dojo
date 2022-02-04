import { Dragon } from '../../../domain/dragon.entity';
import { DragonNotFoundError } from '../../../domain/dragon.error';
import { DragonMockAdapter } from '../../../../infrastructure/mock/dragon.mock-adapter';
import { GetDragonByIdQuery } from './get-dragon-by-id.query';
import { GetDragonByIdQueryHandler } from './get-dragon-by-id.query-handler';

describe('get dragon by id query', () => {
  const dragonMockAdapter = new DragonMockAdapter();
  const getDragonByIdQueryHandler = new GetDragonByIdQueryHandler(
    dragonMockAdapter,
  );

  beforeEach(() => {
    dragonMockAdapter.reset();
  });

  it('should get a dragon by Id', async () => {
    const smaug = await dragonMockAdapter.create({});

    const { dragon } = await getDragonByIdQueryHandler.execute(
      new GetDragonByIdQuery({ dragonId: smaug.id }),
    );
    expect(dragon).toMatchObject(smaug);
    dragonMockAdapter.delete(smaug.id);
  });

  it('should throw if the dragon does not exist', async () => {
    const missingDragonId = 'dragon-id-not-existing' as Dragon['id'];

    await expect(
      getDragonByIdQueryHandler.execute(
        new GetDragonByIdQuery({ dragonId: missingDragonId }),
      ),
    ).rejects.toThrow(new DragonNotFoundError(missingDragonId));
  });
});
