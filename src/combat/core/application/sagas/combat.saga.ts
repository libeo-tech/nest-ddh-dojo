import { Injectable } from '@nestjs/common';
import { EventBus, ICommand, IEvent, ofType, Saga } from '@nestjs/cqrs';
import { filter, map, Observable, tap } from 'rxjs';
import { afterCommand } from '../../../../common/utils/rxjs/after-command';
import { Outcome } from '../../domain/combat-log/combat-log.entity';
import { Fight, reverseFight } from '../../domain/fight/fight.type';
import { Fighter } from '../../domain/fight/fighter.entity';
import { AttackCommand } from '../commands/attack/attack.command';
import { RewardHeroCommand } from '../commands/reward-hero/reward-hero.command';
import { CombatLogIPA } from '../../domain/combat-log/combat-log.ports';
import { FighterIPA } from '../../domain/fight/fighter.ports';
import {
  CombatEndedEvent,
  FighterRetaliationEvent,
  isPvECombatEvent,
  NewCombatRoundEvent,
} from './combat.event';
import { Result } from 'neverthrow';

@Injectable()
export class CombatSagas {
  constructor(
    private readonly combatLogIPA: CombatLogIPA<Fighter, Fighter>,
    private readonly fighterIPA: FighterIPA<Fighter, Fighter>,
    private readonly eventBus: EventBus,
  ) {}

  private async isDefenderDead(
    fight: Fight<Fighter, Fighter>,
  ): Promise<Result<{ isDead: boolean }, Error>> {
    const { defender } = fight;
    return this.fighterIPA.getPorts(fight).isDead(defender.id);
  }

  public async startCombat(fight: Fight<Fighter, Fighter>): Promise<void> {
    const { attacker, defender } = fight;

    const log = await this.combatLogIPA
      .getPorts(fight)
      .create(attacker.id, defender.id);
    await this.eventBus.publish(
      new NewCombatRoundEvent({ fight: { attacker, defender }, logId: log.id }),
    );
  }

  @Saga()
  newRoundHasBegun = (
    events$: Observable<IEvent>,
  ): Observable<AttackCommand<Fighter, Fighter>> => {
    return events$.pipe(
      ofType(NewCombatRoundEvent),
      tap(({ payload }) =>
        this.combatLogIPA.getPorts(payload.fight).logRound(payload.logId),
      ),
      map(({ payload }) => new AttackCommand(payload)),
      afterCommand(this.eventBus, async ({ payload }) => {
        const { fight } = payload;

        const isDeadResult = await this.isDefenderDead(fight);
        if (isDeadResult.isErr()) {
          return new CombatEndedEvent({
            ...payload,
            outcome: Outcome.ERROR,
          });
        }
        if (isDeadResult.isOk()) {
          const { isDead } = isDeadResult.value;
          if (isDead) {
            return new CombatEndedEvent({ ...payload, outcome: Outcome.WIN });
          } else {
            return new FighterRetaliationEvent({
              ...payload,
              fight: reverseFight(fight),
            });
          }
        }
      }),
    );
  };

  @Saga()
  fighterRetaliate = (
    events$: Observable<IEvent>,
  ): Observable<AttackCommand<Fighter, Fighter>> => {
    return events$.pipe(
      ofType(FighterRetaliationEvent),
      map(({ payload }) => new AttackCommand(payload)),
      afterCommand(this.eventBus, async ({ payload }) => {
        const { fight } = payload;

        const isDeadResult = await this.isDefenderDead(fight);
        if (isDeadResult.isErr()) {
          return new CombatEndedEvent({
            ...payload,
            outcome: Outcome.ERROR,
          });
        }
        if (isDeadResult.isOk()) {
          const { isDead } = isDeadResult.value;
          const nextPayload = {
            ...payload,
            fight: reverseFight(fight),
          };
          if (isDead) {
            return new CombatEndedEvent({
              ...nextPayload,
              outcome: Outcome.LOSS,
            });
          } else {
            return new NewCombatRoundEvent(nextPayload);
          }
        }
      }),
    );
  };

  @Saga()
  dragonIsSlain = (events$: Observable<IEvent>): Observable<ICommand> => {
    return events$.pipe(
      ofType(CombatEndedEvent),
      tap(({ payload }) =>
        this.combatLogIPA
          .getPorts(payload.fight)
          .logOutcome(payload.logId, payload.outcome),
      ),
      filter(isPvECombatEvent),
      filter(({ payload }) => payload.outcome === Outcome.WIN),
      map(
        ({
          payload: {
            fight: { attacker, defender },
          },
        }) =>
          new RewardHeroCommand({
            heroId: attacker.id,
            dragonId: defender.id,
          }),
      ),
    );
  };
}
