import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { BaseOrmAdapter } from '../../../../common/infrastructure/base.orm-adapter';
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
import { PvpLog as PvpLogOrmEntity } from './pvp-log.orm-entity';
import { mapPvpLogToCombatLogEntity } from './pvp-log.orm-mapper';

type PvpLog = CombatLog<HeroFighter, HeroFighter>;

@Injectable()
@withSpans()
export class PvpLogAdapter implements CombatLogPorts<HeroFighter, HeroFighter> {
  constructor(
    @InjectRepository(PvpLogOrmEntity)
    private combatLogsRepository: Repository<PvpLogOrmEntity>,
  ) {}

  async create(
    attackerId: Hero['id'],
    defenderId: Hero['id'],
  ): Promise<PvpLog> {
    const log = await this.combatLogsRepository.save({
      attackerId,
      defenderId,
    });
    return mapPvpLogToCombatLogEntity(log);
  }
  async logRound(logId: PvpLog['id']): Promise<void> {
    const log = await this.combatLogsRepository.findOneOrFail(logId);
    await this.combatLogsRepository.update(logId, {
      numberOfRounds: +log.numberOfRounds + 1,
    });
  }
  async logOutcome(logId: PvpLog['id'], outcome: Outcome): Promise<void> {
    await this.combatLogsRepository.update(logId, { outcome });
  }
}
