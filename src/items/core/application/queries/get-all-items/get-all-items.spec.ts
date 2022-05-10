import { ItemMockAdapter } from '../../../../infrastructure/mock/item.mock-adapter';
import { GetAllItemsQueryHandler } from './get-all-items.query-handler';

describe('get all items query', () => {
  const itemMockAdapter = new ItemMockAdapter();
  const getAllItemsQueryHandler = new GetAllItemsQueryHandler(itemMockAdapter);

  beforeEach(() => {
    itemMockAdapter.reset();
  });

  it('should return all items', async () => {
    const [item1, item2] = await Promise.all([
      itemMockAdapter.create({}),
      itemMockAdapter.create({}),
    ]);

    const result = await getAllItemsQueryHandler.execute();
    expect(result.isOk()).toBeTruthy();

    const { items } = result._unsafeUnwrap();
    expect(items.length).toBe(2);
    expect(items[0]).toMatchObject(item1);
    expect(items[1]).toMatchObject(item2);
  });
});
