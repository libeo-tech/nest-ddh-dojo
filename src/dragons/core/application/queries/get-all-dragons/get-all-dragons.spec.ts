import { DragonMockAdapter } from '../../ports/dragon.mock-adapter';
import { GetAllDragonsQueryHandler } from './get-all-dragons.query-handler';

describe('get all dragons query', () => {
  const dragonMockAdapter = new DragonMockAdapter();
  const getAllDragonsQueryHandler = new GetAllDragonsQueryHandler(
    dragonMockAdapter,
  );

  it('should return all dragons', async () => {
    const [dragon1, dragon2] = await Promise.all([
      dragonMockAdapter.createDragon({}),
      dragonMockAdapter.createDragon({}),
    ]);

    const { dragons } = await getAllDragonsQueryHandler.execute();
    expect(dragons.length).toBe(2);
    expect(dragons[0]).toMatchObject(dragon1);
    expect(dragons[1]).toMatchObject(dragon2);
  });
});
