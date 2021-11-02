import { Hero } from '../../../../heroes/core/domain/hero.entity';
import { Item, ItemWithOwner } from '../../domain/item.entity';
import { itemEntityFactory } from '../../domain/item.entity-factory';
import { ItemPorts } from './item.ports';

const isItemWithOwner = (item: Item | ItemWithOwner): item is ItemWithOwner => {
  return item instanceof ItemWithOwner && !!item.owner;
};

export class ItemMockAdapter implements ItemPorts {
  currentId = 0;
  items: Record<Item['id'], Item | ItemWithOwner> = {};
  getAllItems(): Promise<Item[]> {
    return Promise.resolve(Object.values(this.items));
  }
  getItemById(itemId: Item['id']): Promise<Item> {
    return Promise.resolve(this.items[itemId]);
  }
  getItemsByOwnerId(ownerId: Hero['id']): Promise<Item[]> {
    const items = Object.values(this.items);
    const itemsWithOwner = items.filter(isItemWithOwner);
    return Promise.resolve(
      itemsWithOwner.filter((item) => item.owner.id === ownerId),
    );
  }
  createItem(itemProperties: Partial<Item>): Promise<Item> {
    const newItem = itemEntityFactory(itemProperties);
    const id = newItem.id ?? `item${this.currentId++}`;
    this.items[id] = { ...newItem, id };
    return Promise.resolve(this.items[id]);
  }
  updateItem(itemId: Item['id'], itemProperties: Partial<Item>): Promise<Item> {
    this.items[itemId] = { ...this.items[itemId], ...itemProperties };
    return Promise.resolve(this.items[itemId]);
  }
  deleteItem(itemId: Item['id']): Promise<void> {
    delete this.items[itemId];
    return Promise.resolve();
  }
  attributeOwnerOfItem(itemId: Item['id'], ownerId: Hero['id']): Promise<void> {
    const itemWithOwner = Object.assign(new ItemWithOwner(), {
      ...this.items[itemId],
      owner: { id: ownerId } as Hero,
    });
    this.items[itemId] = itemWithOwner;
    return Promise.resolve();
  }
}
