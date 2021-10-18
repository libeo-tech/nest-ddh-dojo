import { Item as ItemEntity } from '../../core/domain/item.entity';
import { Item as ItemOrmEntity } from './item.orm-entity';

export const mapItemOrmEntityToItemEntity = (
  itemOrmEntity: ItemOrmEntity,
): ItemEntity => {
  return {
    id: itemOrmEntity.id,
    name: itemOrmEntity.name,
  };
};
