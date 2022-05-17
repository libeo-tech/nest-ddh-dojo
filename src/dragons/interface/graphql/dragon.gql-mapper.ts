import {
  ColorEnum,
  Dragon as DragonSchema,
  DragonCreationInput,
} from '../../../graphql';
import {
  Dragon as DragonEntity,
  DragonColor,
} from '../../core/domain/dragon.entity';

export const mapDragonEntityToDragonSchema = (
  dragonEntity: DragonEntity,
): DragonSchema => {
  return {
    id: dragonEntity.id,
    level: dragonEntity.level,
    currentHp: dragonEntity.currentHp,
    color: ColorEnum[dragonEntity.color.toUpperCase()],
  };
};

export const mapDragonInputToDragonProperties = (
  dragonInput: DragonCreationInput = {},
): Partial<Pick<DragonEntity, 'level' | 'color'>> => {
  const dragonProperties: Partial<Pick<DragonEntity, 'level' | 'color'>> = {};
  if (dragonInput.level) {
    dragonProperties.level = dragonInput.level;
  }
  if (dragonInput.color) {
    dragonProperties.color = DragonColor[dragonInput.color];
  }
  return dragonProperties;
};
