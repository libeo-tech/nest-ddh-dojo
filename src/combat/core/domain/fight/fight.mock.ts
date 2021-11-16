import { Dragon } from '../../../../dragons/core/domain/dragon.entity';
import { Hero } from '../../../../heroes/core/domain/hero.entity';
import { Fight } from './fight.type';
import { Fighter, FighterType } from './fighter.entity';

const attacker: Fighter = {
  id: 'attackerId' as Hero['id'],
  type: FighterType.HERO,
};
const defender: Fighter = {
  id: 'defenderId' as Dragon['id'],
  type: FighterType.DRAGON,
};

export const mockFight: Fight<Fighter, Fighter> = {
  attacker,
  defender,
};
