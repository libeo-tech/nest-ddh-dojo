import { heroFixtureFactory } from '../../../../../heroes/core/domain/hero.fixture-factory';
import { ItemMockAdapter } from '../../../../infrastructure/mock/item.mock-adapter';
import { GetHeroItemsQuery } from './get-hero-items.query';
import { GetHeroItemsQueryHandler } from './get-hero-items.query-handler';

describe('get all hero items query', () => {
  const itemMockAdapter = new ItemMockAdapter();
  const getHeroItemsQueryHandler = new GetHeroItemsQueryHandler(
    itemMockAdapter,
  );

  it('should get all items belonging to a hero', async () => {
    const batman = heroFixtureFactory({ name: 'Batman' });
    const [item1, item2] = await Promise.all([
      itemMockAdapter.create({}),
      itemMockAdapter.create({}),
    ]);
    await Promise.all([
      itemMockAdapter.attributeOwnerOfItem(item1.id, batman.id),
      itemMockAdapter.attributeOwnerOfItem(item2.id, batman.id),
    ]);
    const query = new GetHeroItemsQuery({ ownerId: batman.id });

    const { items } = await getHeroItemsQueryHandler.execute(query);
    expect(items).toHaveLength(2);
    expect(items[0]).toMatchObject(item1);
    expect(items[1]).toMatchObject(item2);
    itemMockAdapter.delete(item1.id);
    itemMockAdapter.delete(item2.id);
  });
});