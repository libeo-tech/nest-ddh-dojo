import {
  Outcome,
  PveLog as PveLogEntity,
} from '../../../core/domain/combat-log/combat-log.entity';
import { PveLog as PveLogOrmEntity } from '@prisma/client';
import { Hero } from '../../../../heroes/core/domain/hero.entity';
import { Dragon } from '../../../../dragons/core/domain/dragon.entity';

export const mapPveLogOrmEntityToPveLogEntity = (
  pveLog: PveLogOrmEntity,
): PveLogEntity => {
  return {
    id: pveLog.id as PveLogEntity['id'],
    attackerId: pveLog.heroId as Hero['id'],
    defenderId: pveLog.dragonId as Dragon['id'],
    numberOfRounds: pveLog.numberOfRounds,
    outcome: Outcome[pveLog.outcome],
  };
};
