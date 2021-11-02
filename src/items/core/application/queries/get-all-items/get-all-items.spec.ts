import { ItemMockAdapter } from '../../ports/item.mock-adapter';
import { GetAllItemsQueryHandler } from './get-all-items.query-handler';

describe('get all items query', () => {
  const itemMockAdapter = new ItemMockAdapter();
  const getAllItemsQueryHandler = new GetAllItemsQueryHandler(itemMockAdapter);

  it('should return all items', async () => {
    const [item1, item2] = await Promise.all([
      itemMockAdapter.createItem({}),
      itemMockAdapter.createItem({}),
    ]);

    const { items } = await getAllItemsQueryHandler.execute();
    expect(items.length).toBe(2);
    expect(items[0]).toMatchObject(item1);
    expect(items[1]).toMatchObject(item2);
  });
});
