import { ItemPorts } from '../core/application/ports/item.ports';
import { Item } from './typeorm/item.orm-entity';
import { ItemAdapter } from './typeorm/items.adapter';

export const ItemInfrastructure = {
  providers: [{ provide: ItemPorts, useClass: ItemAdapter }],
  repositories: [Item],
};
