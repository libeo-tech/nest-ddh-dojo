import { Hero as HeroSchema } from '../../../graphql';
import { Item } from '../../../items/core/domain/item.entity';
import { Hero as HeroEntity } from '../../core/domain/hero.entity';

export const mapHeroEntityToHeroSchema = (
  hero: HeroEntity,
  inventory?: Item[],
): HeroSchema => {
  return {
    id: hero.id,
    name: hero.name,
    xp: hero.xp,
    level: hero.level,
    currentHp: hero.currentHp,
    inventory,
  };
};
