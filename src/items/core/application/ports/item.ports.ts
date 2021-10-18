import { Hero } from '../../../../heroes/core/domain/hero.entity';
import { Item } from '../../domain/item.entity';

export abstract class ItemPorts {
  abstract getItemById(id: Item['id']): Promise<Item>;
  abstract getAllItems(): Promise<Item[]>;
  abstract getItemsByOwnerId(ownerId: Hero['id']): Promise<Item[]>;
  abstract createItem(itemProperties: Partial<Item>): Promise<Item>;
  abstract deleteItem(id: Item['id']): Promise<void>;
  abstract attributeOwnerOfItem(
    id: Item['id'],
    ownerId: Hero['id'],
  ): Promise<void>;
}
