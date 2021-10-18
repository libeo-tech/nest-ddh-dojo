import { getRandomArrayValue } from '../../../common/utils/random/random-array';
import { capitalizeFirstLetter } from '../../../common/utils/strings/capitalize-first-letter';
import { Item } from './item.entity';

const itemQuality = ['weak', '', 'great', 'magic', 'epic', 'legendary'];
const itemType = ['bow', 'mace', 'sword', 'spear', 'staff', 'wand'];
const itemAttribute = ['', 'of flame', 'of freezing', 'of chaos', 'of poison'];

const generateItemName = () =>
  capitalizeFirstLetter(
    `${getRandomArrayValue(itemQuality)} ${getRandomArrayValue(
      itemType,
    )} ${getRandomArrayValue(itemAttribute)}`.trim(),
  );

export const itemEntityFactory = (itemProperties: Partial<Item> = {}): Item => {
  const item: Item = Object.assign(new Item(), {
    name: generateItemName(),
    ...itemProperties,
  });

  return item;
};
