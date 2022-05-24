import { getRandomArrayValue } from '../../../common/utils/random/random-array';
import { generateRandomNumber } from '../../../common/utils/random/random-number';
import { getHeroMaxHp, Hero } from './hero.entity';

const exampleNames = ['Batman', 'Robin'];

export const heroEntityFactory = (heroProperties: Partial<Hero> = {}): Hero => {
  const level = heroProperties.level ?? generateRandomNumber(1, 10);
  const maxHp = getHeroMaxHp(level);
  return Object.assign(new Hero(), {
    xp: 0,
    level,
    name: getRandomArrayValue(exampleNames),
    currentHp: maxHp,
    ...heroProperties,
  });
};
