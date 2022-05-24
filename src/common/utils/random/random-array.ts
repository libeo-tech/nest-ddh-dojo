import { generateRandomNumber } from './random-number';

export const getRandomArrayValue = <T>(array: T[]): T => {
  return array[generateRandomNumber(0, array.length - 1)];
};
