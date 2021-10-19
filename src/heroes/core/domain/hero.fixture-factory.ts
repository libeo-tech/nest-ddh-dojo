import { getRandomArrayValue } from '../../../common/utils/random/random-array';
import { generateRandomNumber } from '../../../common/utils/random/random-number';
import { Hero } from './hero.entity';

const exampleNames = ['John', 'Bob', 'Steve'];
let heroTestId = 0;

export const heroFixtureFactory = (heroProperties: Partial<Hero>): Hero => {
  heroTestId += 1;
  return Object.assign(new Hero(), {
    id: `heroId${heroTestId}`,
    level: generateRandomNumber(1, 10),
    name: getRandomArrayValue(exampleNames),
    ...heroProperties,
  });
};
