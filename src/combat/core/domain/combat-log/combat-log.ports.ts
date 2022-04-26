import { CombatLog, Outcome } from './combat-log.entity';
import { Fight } from '../fight/fight.type';
import { Fighter } from '../fight/fighter.entity';

export abstract class CombatLogIPA<X extends Fighter, Y extends Fighter> {
  abstract getPorts(fight: Fight<X, Y>): CombatLogPorts<X, Y>;
}

export abstract class CombatLogPorts<X extends Fighter, Y extends Fighter> {
  abstract create(
    attackerId: X['id'],
    defenderId: Y['id'],
  ): Promise<CombatLog<X, Y>>;
  abstract logRound(logId: CombatLog<X, Y>['id']): Promise<void>;
  abstract logOutcome(
    logId: CombatLog<X, Y>['id'],
    outcome: Outcome,
  ): Promise<void>;
}
