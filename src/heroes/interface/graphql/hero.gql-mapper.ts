import { Hero as HeroSchema } from '../../../graphql';
import { Hero as HeroEntity } from '../../core/domain/hero.entity';

export const mapHeroEntityToHeroSchema = (hero: HeroEntity): HeroSchema => {
  return {
    id: hero.id,
    name: hero.name,
    xp: hero.xp,
    level: hero.level,
    currentHp: hero.currentHp,
    equippedItem: hero.equippedItem,
  };
};
