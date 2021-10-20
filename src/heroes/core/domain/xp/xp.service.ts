import { Hero } from '../hero.entity';

export const getXpNeededForNextLevel = (level: Hero['level']): number => {
  return Math.pow(level, 2) * 100;
};

export const doesHeroLevelUp = (hero: Hero): boolean => {
  const { xp, level } = hero;
  return xp >= getXpNeededForNextLevel(level);
};
