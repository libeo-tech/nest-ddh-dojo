import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { withSpans } from '../../../../common/utils/trace/honeycomb';
import { Dragon } from '../../../../dragons/core/domain/dragon.entity';
import { Hero } from '../../../../heroes/core/domain/hero.entity';
import { CombatLogPorts } from '../../../core/domain/combat-log/combat-log.ports';
import {
  CombatLog,
  Outcome,
} from '../../../core/domain/combat-log/combat-log.entity';
import {
  HeroFighter,
  DragonFighter,
} from '../../../core/domain/fight/fighter.entity';
import { PveLog as PveLogOrmEntity } from './pve-log.orm-entity';
import { mapPveLogToCombatLogEntity } from './pve-log.orm-mapper';

type PveLog = CombatLog<HeroFighter, DragonFighter>;

@Injectable()
@withSpans()
export class PveLogAdapter
  implements CombatLogPorts<HeroFighter, DragonFighter>
{
  constructor(
    @InjectRepository(PveLogOrmEntity)
    private combatLogsRepository: Repository<PveLogOrmEntity>,
  ) {}

  async create(heroId: Hero['id'], dragonId: Dragon['id']): Promise<PveLog> {
    const log = await this.combatLogsRepository.save({ heroId, dragonId });
    return mapPveLogToCombatLogEntity(log);
  }
  async logRound(logId: PveLog['id']): Promise<void> {
    const log = await this.combatLogsRepository.findOneOrFail(logId);
    await this.combatLogsRepository.update(logId, {
      numberOfRounds: +log.numberOfRounds + 1,
    });
  }
  async logOutcome(logId: PveLog['id'], outcome: Outcome): Promise<void> {
    await this.combatLogsRepository.update(logId, { outcome });
  }
}
