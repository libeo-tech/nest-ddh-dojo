import {
  AttackerPorts,
  DefenderPorts,
} from '../../core/domain/fight/fighter.ports';
import { Fighter } from '../../core/domain/fight/fighter.entity';

export const attackerMockAdapter: AttackerPorts<Fighter> = {
  getAttackStrength: jest.fn(),
};

export const defenderMockAdapter: DefenderPorts<Fighter, Fighter> = {
  receiveDamage: jest.fn(),
  isDead: jest.fn(),
};
