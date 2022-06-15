import {
  Outcome,
  PvpLog as PvpLogEntity,
} from '../../../core/domain/combat-log/combat-log.entity';
import { PvpLog as PvpLogOrmEntity } from '@prisma/client';
import { Hero } from '../../../../heroes/core/domain/hero.entity';

export const mapPvpLogOrmEntityToPvpLogEntity = (
  pvpLog: PvpLogOrmEntity,
): PvpLogEntity => {
  return {
    id: pvpLog.id as PvpLogEntity['id'],
    attackerId: pvpLog.attackerId as Hero['id'],
    defenderId: pvpLog.defenderId as Hero['id'],
    numberOfRounds: pvpLog.numberOfRounds,
    outcome: Outcome[pvpLog.outcome],
  };
};
