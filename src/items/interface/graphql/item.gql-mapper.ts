import { Item as ItemSchema } from '../../../graphql';
import { Item as ItemEntity } from '../../core/domain/item.entity';

export const mapItemEntityToItemSchema = (
  itemEntity: ItemEntity,
): ItemSchema => {
  return {
    id: itemEntity.id,
    name: itemEntity.name,
  };
};
