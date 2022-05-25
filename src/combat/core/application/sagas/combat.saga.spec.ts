import { err, ok } from 'neverthrow';
import { firstValueFrom, of } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { PublishEventCommand } from '../../../../common/core/commands/publish-event.command';
import { UnknownApplicationError } from '../../../../common/core/domain/base.error';
import { CommandResultEvent } from '../../../../common/core/domain/command-result.event';
import { eventBusMock } from '../../../../common/utils/test/event-bus.mock';
import { testSchedulerFactory } from '../../../../common/utils/test/test-scheduler.factory';
import { combatLogMockAdapter } from '../../../infrastructure/mock/combat-log.mock-adapter';
import { combatLogMockIPA } from '../../../infrastructure/mock/combat-log.mock-ipa';
import { CombatLog, Outcome } from '../../domain/combat-log/combat-log.entity';
import { mockFight } from '../../domain/fight/fight.mock';
import { Fight, reverseFight } from '../../domain/fight/fight.type';
import {
  DragonFighter,
  Fighter,
  HeroFighter,
} from '../../domain/fight/fighter.entity';
import { AttackCommand } from '../commands/attack/attack.command';
import { RewardHeroCommand } from '../commands/reward-hero/reward-hero.command';
import { CombatEndedEvent, NewCombatRoundEvent } from './combat.event';
import { CombatSagas } from './combat.saga';

describe('combat sagas', () => {
  const logId = 'logId' as CombatLog<Fighter, Fighter>['id'];
  const combatSaga = new CombatSagas(combatLogMockIPA, eventBusMock);
  let testScheduler: TestScheduler;

  beforeEach(() => {
    testScheduler = testSchedulerFactory();
  });

  it('should generate an combat log and start a new round', async () => {
    jest
      .spyOn(combatLogMockAdapter, 'create')
      .mockResolvedValueOnce({ id: logId } as CombatLog<Fighter, Fighter>);
    await combatSaga.startCombat(mockFight);

    const { attacker, defender } = mockFight;
    expect(combatLogMockAdapter.create).toHaveBeenCalledWith(
      attacker.id,
      defender.id,
    );
    expect(eventBusMock.publish).toHaveBeenCalledWith(
      new NewCombatRoundEvent({ fight: mockFight, logId }),
    );
  });

  it('should trigger an attack at the beginning of a new round', async () => {
    const payload = { fight: mockFight, logId };
    testScheduler.run(({ hot, expectObservable }) => {
      const events$ = hot('-r-|', {
        r: new NewCombatRoundEvent(payload),
      });

      const output$ = combatSaga.newRoundHasBegun(events$);
      expectObservable(output$).toBe('-a-|', {
        a: new AttackCommand({ ...payload, isRetaliate: false }),
      });
    });
  });

  it('should trigger a retaliation attack if attack did not kill fighter', async () => {
    const payload = { fight: mockFight, logId };
    testScheduler.run(({ hot, expectObservable }) => {
      const events$ = hot('-r-|', {
        r: new CommandResultEvent(
          new AttackCommand({ ...payload, isRetaliate: false }),
          ok({ isDead: false }),
        ),
      });

      const output$ = combatSaga.defenderRetaliate(events$);
      expectObservable(output$).toBe('-a-|', {
        a: new AttackCommand({
          fight: reverseFight(payload.fight),
          logId: payload.logId,
          isRetaliate: true,
        }),
      });
    });
  });

  it('should start a new round after a retaliation attack', async () => {
    const payload = { fight: mockFight, logId };
    testScheduler.run(({ hot, expectObservable }) => {
      const events$ = hot('-r-|', {
        r: new CommandResultEvent(
          new AttackCommand({ ...payload, isRetaliate: true }),
          ok({ isDead: false }),
        ),
      });

      const output$ = combatSaga.endOfRound(events$);
      expectObservable(output$).toBe('-a-|', {
        a: new PublishEventCommand(
          new NewCombatRoundEvent({
            fight: reverseFight(payload.fight),
            logId: payload.logId,
          }),
        ),
      });
    });
  });

  it('should end the fight with a win if fighter dies before retaliation', async () => {
    const payload = { fight: mockFight, logId };
    testScheduler.run(({ hot, expectObservable }) => {
      const events$ = hot('-r-|', {
        r: new CommandResultEvent(
          new AttackCommand({ ...payload, isRetaliate: false }),
          ok({ isDead: true }),
        ),
      });

      const output$ = combatSaga.endOfFight(events$);
      expectObservable(output$).toBe('-a-|', {
        a: new PublishEventCommand(
          new CombatEndedEvent({
            ...payload,
            outcome: Outcome.WIN,
          }),
        ),
      });
    });
  });

  it('should end the fight with a loss if fighter dies after retaliation', async () => {
    const payload = { fight: mockFight, logId };
    testScheduler.run(({ hot, expectObservable }) => {
      const events$ = hot('-r-|', {
        r: new CommandResultEvent(
          new AttackCommand({ ...payload, isRetaliate: true }),
          ok({ isDead: true }),
        ),
      });

      const output$ = combatSaga.endOfFight(events$);
      expectObservable(output$).toBe('-a-|', {
        a: new PublishEventCommand(
          new CombatEndedEvent({
            fight: reverseFight(payload.fight),
            logId: payload.logId,
            outcome: Outcome.LOSS,
          }),
        ),
      });
    });
  });

  it('should end the fight with an error if attack errored', async () => {
    const payload = { fight: mockFight, logId };
    testScheduler.run(({ hot, expectObservable }) => {
      const events$ = hot('-r-|', {
        r: new CommandResultEvent(
          new AttackCommand({ ...payload, isRetaliate: true }),
          err(new UnknownApplicationError('random error')),
        ),
      });

      const output$ = combatSaga.errorOnAttack(events$);
      expectObservable(output$).toBe('-a-|', {
        a: new PublishEventCommand(
          new CombatEndedEvent({
            ...payload,
            outcome: Outcome.ERROR,
          }),
        ),
      });
    });
  });

  it('should award a hero when a dragon is slain', async () => {
    const pveFight = mockFight as Fight<HeroFighter, DragonFighter>;
    const command = await firstValueFrom(
      combatSaga.dragonIsSlain(
        of(
          new CombatEndedEvent<HeroFighter, DragonFighter>({
            fight: pveFight,
            logId,
            outcome: Outcome.WIN,
          }),
        ),
      ),
    );
    expect(command).toBeInstanceOf(RewardHeroCommand);
  });
});
