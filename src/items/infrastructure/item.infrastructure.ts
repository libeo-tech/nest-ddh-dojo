import { Item, ItemWithOwner } from '../core/domain/item.entity';
import { Item as ItemOrmEntity } from './typeorm/item.orm-entity';
import { ItemAdapter } from './typeorm/items.adapter';

export const ItemInfrastructure = {
  providers: [
    { provide: Item.name, useClass: ItemAdapter },
    { provide: ItemWithOwner.name, useClass: ItemAdapter },
  ],
  repositories: [ItemOrmEntity],
};
