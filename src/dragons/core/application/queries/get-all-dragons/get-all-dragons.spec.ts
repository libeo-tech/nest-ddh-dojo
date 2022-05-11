import { DragonMockAdapter } from '../../../../infrastructure/mock/dragon.mock-adapter';
import { GetAllDragonsQueryHandler } from './get-all-dragons.query-handler';

describe('get all dragons query', () => {
  const dragonMockAdapter = new DragonMockAdapter();
  const getAllDragonsQueryHandler = new GetAllDragonsQueryHandler(
    dragonMockAdapter,
  );

  it('should return all dragons', async () => {
    const [dragon1, dragon2] = await Promise.all([
      dragonMockAdapter.create({}),
      dragonMockAdapter.create({}),
    ]);

    const result = await getAllDragonsQueryHandler.execute();
    expect(result.isOk()).toBeTruthy();

    const { dragons } = result._unsafeUnwrap();
    expect(dragons.length).toBe(2);
    expect(dragons[0]).toMatchObject(dragon1);
    expect(dragons[1]).toMatchObject(dragon2);
  });
});
