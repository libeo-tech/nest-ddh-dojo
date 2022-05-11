import { MockAdapter } from '../../../common/infrastructure/base.mock-adapter';
import { Hero } from '../../../heroes/core/domain/hero.entity';
import { Item, ItemWithOwner } from '../../core/domain/item.entity';
import { itemEntityFactory } from '../../core/domain/item.entity-factory';
import { ItemWithOwnerPorts } from '../../core/domain/item-with-owner.ports';

const isItemWithOwner = (item: Item | ItemWithOwner): item is ItemWithOwner => {
  return item instanceof ItemWithOwner && !!item.owner;
};

export class ItemMockAdapter
  extends MockAdapter<Item>
  implements ItemWithOwnerPorts
{
  entityName = 'Item';
  entityFactory = itemEntityFactory;
  getItemsByOwnerId(ownerId: Hero['id']): Promise<Item[]> {
    const items = Object.values(this.entities);
    const itemsWithOwner = items.filter(isItemWithOwner);
    return Promise.resolve(
      itemsWithOwner
        .filter((item) => item.owner.id === ownerId)
        .map(({ owner: _, ...item }) => item),
    );
  }
  attributeOwnerOfItem(itemId: Item['id'], ownerId: Hero['id']): Promise<void> {
    const itemWithOwner = Object.assign(new ItemWithOwner(), {
      ...this.entities[itemId],
      owner: { id: ownerId } as Hero,
    });
    this.entities[itemId] = itemWithOwner;
    return Promise.resolve();
  }
}
