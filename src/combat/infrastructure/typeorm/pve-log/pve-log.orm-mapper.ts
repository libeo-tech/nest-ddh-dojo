import { CombatLog } from '../../../core/domain/combat-log/combat-log.entity';
import {
  DragonFighter,
  HeroFighter,
} from '../../../core/domain/fight/fighter.entity';
import { PveLog } from './pve-log.orm-entity';

export const mapPveLogToCombatLogEntity = (
  pveLog: PveLog,
): CombatLog<HeroFighter, DragonFighter> => {
  return {
    id: pveLog.id,
    attackerId: pveLog.heroId,
    defenderId: pveLog.dragonId,
    numberOfRounds: +pveLog.numberOfRounds,
    outcome: pveLog.outcome,
  };
};
