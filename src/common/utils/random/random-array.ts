import { generateRandomNumber } from './random-number';

export const getRandomArrayValue = (array) => {
  return array[generateRandomNumber(0, array.length - 1)];
};
