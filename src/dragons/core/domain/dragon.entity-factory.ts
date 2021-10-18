import { getRandomEnumValue } from '../../../common/utils/random/random-enum';
import { generateRandomNumber } from '../../../common/utils/random/random-number';
import { Dragon, DragonColor } from './dragon.entity';

export const dragonEntityFactory = (
  dragonProperties: Partial<Dragon> = {},
): Dragon => {
  const dragon: Dragon = Object.assign(new Dragon(), {
    level: generateRandomNumber(1, 10),
    color: getRandomEnumValue(DragonColor),
    ...dragonProperties,
  });

  return dragon;
};
