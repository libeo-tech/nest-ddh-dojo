import { ColorEnum, Dragon as DragonSchema } from '../../../graphql';
import { Dragon as DragonEntity } from '../../core/domain/dragon.entity';

export const mapDragonEntityToDragonSchema = (
  dragonEntity: DragonEntity,
): DragonSchema => {
  return {
    id: dragonEntity.id,
    level: dragonEntity.level,
    color: ColorEnum[dragonEntity.color.toUpperCase()],
  };
};
