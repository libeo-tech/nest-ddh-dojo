import {
  Dragon as DragonEntity,
  DragonColor,
} from '../../core/domain/dragon.entity';
import {
  dragon as DragonOrmEntity,
  dragon_color_enum,
  Prisma,
} from '@prisma/client';

export const mapDragonOrmEntityToDragonEntity = (
  dragonOrmEntity: DragonOrmEntity,
): DragonEntity => {
  return {
    id: dragonOrmEntity.id as DragonEntity['id'],
    currentHp: dragonOrmEntity.currentHp,
    level: +dragonOrmEntity.level,
    color: DragonColor[dragonOrmEntity.color.toUpperCase()],
  };
};

export const mapEntityPropertiesToOrmEntityProperties = (
  entityProperties: Partial<DragonEntity>,
): Prisma.dragonCreateInput => {
  const { color, ...fields } = entityProperties;
  if (color) {
    fields['color'] = dragon_color_enum[color.toLowerCase()];
  }
  return fields;
};
