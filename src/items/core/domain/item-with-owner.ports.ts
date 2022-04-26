import { Hero } from '../../../heroes/core/domain/hero.entity';
import { Item } from './item.entity';

export abstract class ItemWithOwnerPorts {
  abstract getItemsByOwnerId(ownerId: Hero['id']): Promise<Item[]>;
  abstract attributeOwnerOfItem(
    id: Item['id'],
    ownerId: Hero['id'],
  ): Promise<void>;
}
