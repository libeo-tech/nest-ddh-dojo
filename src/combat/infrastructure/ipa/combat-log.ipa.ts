import { Injectable } from '@nestjs/common';
import {
  CombatLogIPA,
  CombatLogPorts,
} from '../../core/domain/combat-log/combat-log.ports';
import {
  Fight,
  isPvEFight,
  isPvPFight,
} from '../../core/domain/fight/fight.type';
import { Fighter } from '../../core/domain/fight/fighter.entity';
import { PveLogAdapter } from '../prisma/pve-log/pve-log.adapter';
import { PvpLogAdapter } from '../prisma/pvp-log/pvp-log.adapter';

@Injectable()
export class CombatLogIPAdapter implements CombatLogIPA<Fighter, Fighter> {
  constructor(
    private readonly pveCombatLog: PveLogAdapter,
    private readonly pvpCombatLog: PvpLogAdapter,
  ) {}

  getPorts(fight: Fight<Fighter, Fighter>): CombatLogPorts<Fighter, Fighter> {
    if (isPvEFight(fight)) {
      return this.pveCombatLog;
    }
    if (isPvPFight(fight)) {
      return this.pvpCombatLog;
    }
    throw new Error(`IPA not implemented for fight ${JSON.stringify(fight)}`);
  }
}
