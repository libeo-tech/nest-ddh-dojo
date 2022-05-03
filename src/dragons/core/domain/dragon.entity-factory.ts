import { getRandomEnumValue } from '../../../common/utils/random/random-enum';
import { generateRandomNumber } from '../../../common/utils/random/random-number';
import { Dragon, DragonColor, getDragonMaxHp } from './dragon.entity';

export const dragonEntityFactory = (
  dragonProperties: Partial<Dragon> = {},
): Dragon => {
  const level = dragonProperties.level || generateRandomNumber(1, 10);
  const dragon: Dragon = Object.assign(new Dragon(), {
    level,
    currentHp: getDragonMaxHp(level),
    color: getRandomEnumValue(DragonColor),
    ...dragonProperties,
  });

  return dragon;
};
