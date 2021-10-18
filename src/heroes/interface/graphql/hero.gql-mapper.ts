import { Hero as HeroSchema } from '../../../graphql';
import { Item } from '../../../items/core/domain/item.entity';
import { Hero as HeroEntity } from '../../core/domain/hero.entity';

export const mapHeroEntityToHeroSchema = (
  heroEntity: HeroEntity,
  inventory: Item[],
): HeroSchema => {
  return {
    id: heroEntity.id,
    name: heroEntity.name,
    level: heroEntity.level,
    inventory,
  };
};
