import { getRandomArrayValue } from './random-array';

export const getRandomEnumValue = (
  enumeration: Record<string, string>,
): string => {
  const values = Object.keys(enumeration);
  return enumeration[getRandomArrayValue(values)];
};
