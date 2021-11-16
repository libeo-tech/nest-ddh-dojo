import { Injectable } from '@nestjs/common';
import { EventBus, ICommand, ofType, Saga } from '@nestjs/cqrs';
import { filter, map, Observable, tap } from 'rxjs';
import { Outcome } from '../../domain/combat-log/combat-log.entity';
import { Fight } from '../../domain/fight/fight.type';
import { Fighter } from '../../domain/fight/fighter.entity';
import { AttackCommand } from '../commands/attack/attack.command';
import { RewardHeroCommand } from '../commands/reward-hero/reward-hero.command';
import { CombatLogIPA } from '../ports/combat-log.ports';
import { FightIPA } from '../ports/fighter.ports';
import {
  CombatEndedEvent,
  FighterRetaliationEvent,
  isPvEFightEvent,
  NewCombatRoundEvent,
} from './combat.event';

@Injectable()
export class CombatSagas {
  constructor(
    private readonly combatLogIPA: CombatLogIPA<Fighter, Fighter>,
    private readonly fighterIPA: FightIPA<Fighter, Fighter>,
    private readonly eventBus: EventBus,
  ) {}

  private async isDefenderDead(
    fight: Fight<Fighter, Fighter>,
  ): Promise<boolean> {
    const { defender } = fight;
    return this.fighterIPA.getPorts(fight).isDead(defender.id);
  }

  private reverseFight(
    fight: Fight<Fighter, Fighter>,
  ): Fight<Fighter, Fighter> {
    const { attacker, defender } = fight;
    return {
      attacker: defender,
      defender: attacker,
    };
  }

  private async awaitAttack(
    attackCommand: AttackCommand<Fighter, Fighter>,
  ): Promise<AttackCommand<Fighter, Fighter>['payload']> {
    await new Promise(
      (resolve) => (attackCommand.afterHook = () => resolve(null)),
    );
    return attackCommand.payload;
  }

  @Saga()
  newRoundHasBegun = (
    events$: Observable<any>,
  ): Observable<AttackCommand<Fighter, Fighter>> => {
    return events$.pipe(
      ofType(NewCombatRoundEvent),
      tap(({ payload }) =>
        this.combatLogIPA.getPorts(payload.fight).logRound(payload.logId),
      ),
      map(({ payload }) => new AttackCommand(payload)),
      tap(async (attackCommand) => {
        const payload = await this.awaitAttack(attackCommand);
        const { fight } = payload;

        const isDead = await this.isDefenderDead(fight);
        if (isDead) {
          this.eventBus.publish(
            new CombatEndedEvent({ ...payload, outcome: Outcome.WIN }),
          );
        } else {
          this.eventBus.publish(
            new FighterRetaliationEvent({
              ...payload,
              fight: this.reverseFight(fight),
            }),
          );
        }
      }),
    );
  };

  @Saga()
  fighterRetaliate = (
    events$: Observable<any>,
  ): Observable<AttackCommand<Fighter, Fighter>> => {
    return events$.pipe(
      ofType(FighterRetaliationEvent),
      map(({ payload }) => new AttackCommand(payload)),
      tap(async (attackCommand) => {
        const payload = await this.awaitAttack(attackCommand);
        const { fight } = payload;

        const isDead = await this.isDefenderDead(fight);
        const nextPayload = {
          ...payload,
          fight: this.reverseFight(fight),
        };
        if (isDead) {
          this.eventBus.publish(
            new CombatEndedEvent({ ...nextPayload, outcome: Outcome.LOSS }),
          );
        } else {
          this.eventBus.publish(new NewCombatRoundEvent({ ...nextPayload }));
        }
      }),
    );
  };

  @Saga()
  dragonIsSlain = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(CombatEndedEvent),
      tap(({ payload }) =>
        this.combatLogIPA
          .getPorts(payload.fight)
          .logOutcome(payload.logId, payload.outcome),
      ),
      filter(isPvEFightEvent),
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
