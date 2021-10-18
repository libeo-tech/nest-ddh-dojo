import { ItemPorts } from '../core/application/ports/item.ports';
import { Item } from './items/item.orm-entity';
import { ItemAdapter } from './items/items.adapter';

export const ItemInfrastructure = {
  providers: [{ provide: ItemPorts, useClass: ItemAdapter }],
  repositories: [Item],
};
