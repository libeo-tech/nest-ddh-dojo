import { Dragon as DragonEntity } from '../../core/domain/dragon.entity';
import { Dragon as DragonOrmEntity } from './dragon.orm-entity';

export const mapDragonOrmEntityToDragonEntity = (
  dragonOrmEntity: DragonOrmEntity,
): DragonEntity => {
  return {
    id: dragonOrmEntity.id,
    currentHp: +dragonOrmEntity.currentHp,
    level: +dragonOrmEntity.level,
    color: dragonOrmEntity.color,
  };
};
