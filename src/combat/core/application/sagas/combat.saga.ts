import { Injectable } from '@nestjs/common';
import { EventBus, ICommand, IEvent, ofType, Saga } from '@nestjs/cqrs';
import { filter, map, merge, Observable, tap } from 'rxjs';
import { Outcome } from '../../domain/combat-log/combat-log.entity';
import { Fight, reverseFight } from '../../domain/fight/fight.type';
import { Fighter } from '../../domain/fight/fighter.entity';
import {
  AttackCommand,
  AttackCommandResult,
} from '../commands/attack/attack.command';
import { RewardHeroCommand } from '../commands/reward-hero/reward-hero.command';
import { CombatLogIPA } from '../../domain/combat-log/combat-log.ports';
import {
  CombatEndedEvent,
  isPvECombatEvent,
  NewCombatRoundEvent,
} from './combat.event';
import { PublishEventCommand } from '../../../../common/core/commands/publish-event.command';
import { afterCommand } from '../../../../common/utils/rxjs/after-command';
import { publishEvent } from '../../../../common/utils/rxjs/publish-event';

const afterAttackCommand = afterCommand<
  AttackCommand<Fighter, Fighter>,
  AttackCommandResult
>(AttackCommand);

@Injectable()
export class CombatSagas {
  constructor(
    private readonly combatLogIPA: CombatLogIPA<Fighter, Fighter>,
    private readonly eventBus: EventBus,
  ) {}

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
      map(
        ({ payload }) => new AttackCommand({ ...payload, isRetaliate: false }),
      ),
    );
  };

  @Saga()
  defenderRetaliate = (
    events$: Observable<IEvent>,
  ): Observable<AttackCommand<Fighter, Fighter>> => {
    return events$.pipe(
      afterAttackCommand,
      filter(({ result }) => result.isOk() && !result.value.isDead),
      filter(({ command: { payload } }) => !payload.isRetaliate),
      map(
        ({ command: { payload } }) =>
          new AttackCommand({
            fight: reverseFight(payload.fight),
            logId: payload.logId,
            isRetaliate: true,
          }),
      ),
    );
  };

  @Saga()
  endOfRound = (
    events$: Observable<IEvent>,
  ): Observable<PublishEventCommand<NewCombatRoundEvent<Fighter, Fighter>>> => {
    return events$.pipe(
      afterAttackCommand,
      filter(({ result }) => result.isOk() && !result.value.isDead),
      filter(({ command: { payload } }) => payload.isRetaliate),
      publishEvent(
        ({ command: { payload } }) =>
          new NewCombatRoundEvent({
            fight: reverseFight(payload.fight),
            logId: payload.logId,
          }),
      ),
    );
  };

  @Saga()
  errorOnAttack = (
    events$: Observable<IEvent>,
  ): Observable<PublishEventCommand<CombatEndedEvent<Fighter, Fighter>>> => {
    return events$.pipe(
      afterAttackCommand,
      filter(({ result }) => result.isErr()),
      publishEvent(
        ({ command: { payload } }) =>
          new CombatEndedEvent({
            fight: payload.fight,
            logId: payload.logId,
            outcome: Outcome.ERROR,
          }),
      ),
    );
  };

  @Saga()
  endOfFight = (
    events$: Observable<IEvent>,
  ): Observable<PublishEventCommand<CombatEndedEvent<Fighter, Fighter>>> => {
    const $endOfFight = events$.pipe(
      afterAttackCommand,
      filter(({ result }) => result.isOk() && result.value.isDead),
    );

    const $attackerWon = $endOfFight.pipe(
      filter(({ command: { payload } }) => !payload.isRetaliate),
      publishEvent(
        ({ command: { payload } }) =>
          new CombatEndedEvent({
            fight: payload.fight,
            logId: payload.logId,
            outcome: Outcome.WIN,
          }),
      ),
    );
    const $attackerLost = $endOfFight.pipe(
      filter(({ command: { payload } }) => payload.isRetaliate),
      publishEvent(
        ({ command: { payload } }) =>
          new CombatEndedEvent({
            fight: reverseFight(payload.fight),
            logId: payload.logId,
            outcome: Outcome.LOSS,
          }),
      ),
    );

    return merge($attackerWon, $attackerLost);
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
