import { Injectable } from '@nestjs/common';
import { CombatOutcomeEnum } from '@prisma/client';
import { Hero } from '../../../../heroes/core/domain/hero.entity';
import { PrismaService } from '../../../../prisma/prisma.service';
import {
  Outcome,
  PvpLog,
} from '../../../core/domain/combat-log/combat-log.entity';
import { CombatLogPorts } from '../../../core/domain/combat-log/combat-log.ports';
import { HeroFighter } from '../../../core/domain/fight/fighter.entity';
import { mapPvpLogOrmEntityToPvpLogEntity } from './pvp-log.orm-mapper';

@Injectable()
export class PvpLogAdapter implements CombatLogPorts<HeroFighter, HeroFighter> {
  constructor(private prisma: PrismaService) {}

  async create(
    attackerId: Hero['id'],
    defenderId: Hero['id'],
  ): Promise<PvpLog> {
    const log = await this.prisma.pvpLog.create({
      data: { attackerId, defenderId },
    });
    return mapPvpLogOrmEntityToPvpLogEntity(log);
  }

  async logRound(logId: PvpLog['id']): Promise<void> {
    const log = await this.prisma.pvpLog.findFirst({
      where: { id: logId },
    });
    log.numberOfRounds += 1;
    await this.prisma.pvpLog.update({
      where: { id: logId },
      data: { numberOfRounds: 1 },
    });
  }

  async logOutcome(logId: PvpLog['id'], outcome: Outcome): Promise<void> {
    await this.prisma.pvpLog.update({
      where: { id: logId },
      data: { outcome: CombatOutcomeEnum[outcome] },
    });
  }
}
