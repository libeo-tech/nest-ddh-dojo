import { CombatLog } from '../../../core/domain/combat-log/combat-log.entity';
import { HeroFighter } from '../../../core/domain/fight/fighter.entity';
import { PvpLog } from './pvp-log.orm-entity';

export const mapPvpLogToCombatLogEntity = (
  pvpLog: PvpLog,
): CombatLog<HeroFighter, HeroFighter> => {
  return {
    id: pvpLog.id,
    attackerId: pvpLog.attackerId,
    defenderId: pvpLog.defenderId,
    numberOfRounds: +pvpLog.numberOfRounds,
    outcome: pvpLog.outcome,
  };
};
