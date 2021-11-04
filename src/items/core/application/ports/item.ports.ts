import { BasePorts } from '../../../../common/core/ports/base.ports';
import { Hero } from '../../../../heroes/core/domain/hero.entity';
import { Item } from '../../domain/item.entity';

export abstract class ItemPorts extends BasePorts<Item> {
  abstract getItemsByOwnerId(ownerId: Hero['id']): Promise<Item[]>;
  abstract attributeOwnerOfItem(
    id: Item['id'],
    ownerId: Hero['id'],
  ): Promise<void>;
}
