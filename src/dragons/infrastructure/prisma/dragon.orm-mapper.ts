import {
  Dragon as DragonEntity,
  DragonColor,
} from '../../core/domain/dragon.entity';
import {
  Dragon as DragonOrmEntity,
  DragonColorEnum,
  Prisma,
} from '@prisma/client';

export const mapDragonOrmEntityToDragonEntity = (
  dragonOrmEntity: DragonOrmEntity,
): DragonEntity => {
  return {
    id: dragonOrmEntity.id as DragonEntity['id'],
    currentHp: dragonOrmEntity.currentHp,
    level: +dragonOrmEntity.level,
    color: DragonColor[dragonOrmEntity.color],
  };
};

export const mapEntityPropertiesToOrmEntityProperties = (
  entityProperties: Partial<DragonEntity>,
): Prisma.OptionalFlat<DragonOrmEntity> => {
  const { color, ...fields } = entityProperties;
  if (color) {
    fields['color'] = DragonColorEnum[color];
  }
  return fields;
};
