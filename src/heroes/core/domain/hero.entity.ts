import { Base } from '../../../common/core/domain/base.entity';
import { generateRandomNumber } from '../../../common/utils/random/random-number';
import { Item } from '../../../items/core/domain/item.entity';

export const getHeroMaxHp = (level: Hero['level']): number => {
  return level * 10;
};

export const getHeroAttackValue = (hero: Hero): number => {
  const baseValue = hero.equippedItem ? hero.level + 1 : hero.level;
  return generateRandomNumber(baseValue, baseValue * 2);
};

export class Hero extends Base {
  id: string & { __brand: 'heroId' };
  name: string;
  xp: number;
  level: number;
  currentHp: number;
  equippedItem?: Item['id'];
}
