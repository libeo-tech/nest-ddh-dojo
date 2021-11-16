import { CombatLogPorts } from '../../core/application/ports/combat-log.ports';
import { Fighter } from '../../core/domain/fight/fighter.entity';

export const combatLogMockAdapter: CombatLogPorts<Fighter, Fighter> = {
  create: jest.fn(),
  logRound: jest.fn(),
  logOutcome: jest.fn(),
};
