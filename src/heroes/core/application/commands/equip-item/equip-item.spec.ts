import { ItemMockAdapter } from '../../../../../items/infrastructure/mock/item.mock-adapter';
import { HeroMockAdapter } from '../../../../infrastructure/mock/hero.mock-adapter';
import { EquipItemCommand } from './equip-item.command';
import { EquipItemCommandHandler } from './equip-item.command-handler';

describe('equip item command', () => {
  const heroMockAdapter = new HeroMockAdapter();
  const itemMockAdapter = new ItemMockAdapter();
  const equipItemCommandHandler = new EquipItemCommandHandler(heroMockAdapter);

  beforeEach(() => {
    heroMockAdapter.reset();
    itemMockAdapter.reset();
  });

  it('hero that equip an item should have an equipped item', async () => {
    const { id: heroId } = await heroMockAdapter.create({});
    const { id: itemId } = await itemMockAdapter.create({});
    await equipItemCommandHandler.execute(
      new EquipItemCommand({ heroId, itemId }),
    );

    const hero = await heroMockAdapter.getById(heroId);
    expect(hero.equippedItem).toStrictEqual(itemId);
  });
});
