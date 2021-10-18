import { getRandomArrayValue } from './random-array';

export const getRandomEnumValue = (enumeration) => {
  const values = Object.keys(enumeration);
  return enumeration[getRandomArrayValue(values)];
};
