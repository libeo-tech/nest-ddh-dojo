import { CombatLogIPA } from '../../core/domain/combat-log/combat-log.ports';
import { Fighter } from '../../core/domain/fight/fighter.entity';
import { combatLogMockAdapter } from './combat-log.mock-adapter';

export const combatLogMockIPA: CombatLogIPA<Fighter, Fighter> = {
  getPorts: () => combatLogMockAdapter,
};
