import { Injectable } from '@nestjs/common';
import { CombatOutcomeEnum } from '@prisma/client';
import { Dragon } from '../../../../dragons/core/domain/dragon.entity';
import { Hero } from '../../../../heroes/core/domain/hero.entity';
import { PrismaService } from '../../../../prisma/prisma.service';
import {
  Outcome,
  PveLog,
} from '../../../core/domain/combat-log/combat-log.entity';
import { CombatLogPorts } from '../../../core/domain/combat-log/combat-log.ports';
import {
  DragonFighter,
  HeroFighter,
} from '../../../core/domain/fight/fighter.entity';
import { mapPveLogOrmEntityToPveLogEntity } from './pve-log.orm-mapper';

@Injectable()
export class PveLogAdapter
  implements CombatLogPorts<HeroFighter, DragonFighter>
{
  constructor(private prisma: PrismaService) {}

  async create(
    attackerId: Hero['id'],
    defenderId: Dragon['id'],
  ): Promise<PveLog> {
    const log = await this.prisma.pveLog.create({
      data: { heroId: attackerId, dragonId: defenderId },
    });
    return mapPveLogOrmEntityToPveLogEntity(log);
  }

  async logRound(logId: PveLog['id']): Promise<void> {
    const log = await this.prisma.pveLog.findFirst({
      where: { id: logId },
    });
    log.numberOfRounds += 1;
    await this.prisma.pveLog.update({
      where: { id: logId },
      data: { numberOfRounds: 1 },
    });
  }

  async logOutcome(logId: PveLog['id'], outcome: Outcome): Promise<void> {
    await this.prisma.pveLog.update({
      where: { id: logId },
      data: { outcome: CombatOutcomeEnum[outcome] },
    });
  }
}
