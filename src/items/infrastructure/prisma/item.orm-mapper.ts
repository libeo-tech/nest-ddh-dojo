import { Item as ItemEntity } from '../../core/domain/item.entity';
import { Item as ItemOrmEntity, Prisma } from '@prisma/client';

export const mapItemOrmEntityToItemEntity = (
  itemOrmEntity: ItemOrmEntity,
): ItemEntity => {
  return {
    id: itemOrmEntity.id as ItemEntity['id'],
    name: itemOrmEntity.name,
  };
};

export const mapEntityPropertiesToOrmEntityProperties = (
  entityProperties: Partial<ItemEntity>,
): Prisma.OptionalFlat<ItemOrmEntity> => entityProperties;
