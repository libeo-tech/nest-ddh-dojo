import { Base } from '../../../common/core/domain/base.entity';
import { generateRandomNumber } from '../../../common/utils/random/random-number';

export const getHeroMaxHp = (level: Hero['level']): number => {
  return level * 10;
};

export const getHeroAttackValue = (hero: Hero): number => {
  return generateRandomNumber(hero.level, hero.level * 2);
};

export class Hero extends Base {
  id: string & { __brand: 'heroId' };
  name: string;
  xp: number;
  level: number;
  currentHp: number;
}
