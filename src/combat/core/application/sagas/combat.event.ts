import { IEvent } from '@nestjs/cqrs';
import { CombatLog, Outcome } from '../../domain/combat-log/combat-log.entity';
import {
  Fight,
  isPvEFight,
  isPvPFight,
  PvEFight,
  PvPFight,
} from '../../domain/fight/fight.type';
import { Fighter } from '../../domain/fight/fighter.entity';

class CombatEvent<X extends Fighter, Y extends Fighter> implements IEvent {
  constructor(
    public readonly payload: {
      fight: Fight<X, Y>;
      logId: CombatLog<X, Y>['id'];
    },
  ) {}
}

export const isPvECombatEvent = <E extends CombatEvent<Fighter, Fighter>>(
  event: E,
): event is E & { payload: { fight: PvEFight } } => {
  const { fight } = event.payload;
  return isPvEFight(fight);
};

export const isPvPCombatEvent = <E extends CombatEvent<Fighter, Fighter>>(
  event: E,
): event is E & { payload: { fight: PvPFight } } => {
  const { fight } = event.payload;
  return isPvPFight(fight);
};

export class NewCombatRoundEvent<
  X extends Fighter,
  Y extends Fighter,
> extends CombatEvent<X, Y> {}

export class CombatEndedEvent<
  X extends Fighter,
  Y extends Fighter,
> extends CombatEvent<X, Y> {
  constructor(
    public readonly payload: {
      fight: Fight<X, Y>;
      logId: CombatLog<X, Y>['id'];
      outcome: Outcome;
    },
  ) {
    super(payload);
  }
}
