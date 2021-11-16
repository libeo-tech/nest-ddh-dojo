import { FighterPorts } from '../../core/application/ports/fighter.ports';
import { Fighter } from '../../core/domain/fight/fighter.entity';

export const fightMockAdapter: FighterPorts<Fighter, Fighter> = {
  getAttackStrength: jest.fn(),
  receiveDamage: jest.fn(),
  isDead: jest.fn(),
};
