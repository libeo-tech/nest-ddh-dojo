import { generateRandomNumber } from '../../../../common/utils/random/random-number';
import { Hero } from '../hero.entity';

export const getHeroAttackStrength = (hero: Hero): number => {
  const { level } = hero;
  return generateRandomNumber(level, level * 2);
};
