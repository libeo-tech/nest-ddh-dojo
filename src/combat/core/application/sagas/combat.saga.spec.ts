import { ok } from 'neverthrow';
import { firstValueFrom, of } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { afterCommandTest } from '../../../../common/utils/rxjs/after-command-test';
import { eventBusMock } from '../../../../common/utils/test/event-bus.mock';
import { testSchedulerFactory } from '../../../../common/utils/test/test-scheduler.factory';
import { combatLogMockAdapter } from '../../../infrastructure/mock/combat-log.mock-adapter';
import { combatLogMockIPA } from '../../../infrastructure/mock/combat-log.mock-ipa';
import { fightMockAdapter } from '../../../infrastructure/mock/fight.mock-adapter';
import { fightMockIPA } from '../../../infrastructure/mock/fight.mock-ipa';
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
import {
  CombatEndedEvent,
  FighterRetaliationEvent,
  NewCombatRoundEvent,
} from './combat.event';
import { CombatSagas } from './combat.saga';

describe('combat sagas', () => {
  const logId = 'logId' as CombatLog<Fighter, Fighter>['id'];
  const combatSaga = new CombatSagas(
    combatLogMockIPA,
    fightMockIPA,
    eventBusMock,
  );
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
        a: new AttackCommand(payload),
      });
    });
  });

  it('should publish a retaliate event if attack did not kill fighter', async () => {
    jest
      .spyOn(fightMockAdapter, 'isDead')
      .mockResolvedValueOnce(ok({ isDead: false }));
    await firstValueFrom(
      combatSaga
        .newRoundHasBegun(
          of(new NewCombatRoundEvent({ fight: mockFight, logId })),
        )
        .pipe(afterCommandTest()),
    );

    expect(fightMockAdapter.isDead).toBeCalledWith(mockFight.defender.id);
    expect(eventBusMock.publish).toBeCalledWith(
      new FighterRetaliationEvent({ fight: reverseFight(mockFight), logId }),
    );
  });

  it('should publish a winning end of combat event if first attack killed fighter', async () => {
    jest
      .spyOn(fightMockAdapter, 'isDead')
      .mockResolvedValueOnce(ok({ isDead: true }));
    await firstValueFrom(
      combatSaga
        .newRoundHasBegun(
          of(new NewCombatRoundEvent({ fight: mockFight, logId })),
        )
        .pipe(afterCommandTest()),
    );

    expect(fightMockAdapter.isDead).toBeCalledWith(mockFight.defender.id);
    expect(eventBusMock.publish).toBeCalledWith(
      new CombatEndedEvent({ fight: mockFight, outcome: Outcome.WIN, logId }),
    );
  });

  it('should trigger an attack when a fighter retaliate', async () => {
    const command = await firstValueFrom(
      combatSaga.fighterRetaliate(
        of(new FighterRetaliationEvent({ fight: mockFight, logId })),
      ),
    );
    expect(command).toBeInstanceOf(AttackCommand);
  });

  it('should publish a new round event if retaliate did not kill fighter', async () => {
    jest
      .spyOn(fightMockAdapter, 'isDead')
      .mockResolvedValueOnce(ok({ isDead: false }));
    await firstValueFrom(
      combatSaga
        .fighterRetaliate(
          of(new FighterRetaliationEvent({ fight: mockFight, logId })),
        )
        .pipe(afterCommandTest()),
    );
    expect(fightMockAdapter.isDead).toBeCalledWith(mockFight.defender.id);
    expect(eventBusMock.publish).toBeCalledWith(
      new NewCombatRoundEvent({ fight: reverseFight(mockFight), logId }),
    );
  });

  it('should publish a losing end of combat event if retaliate killed fighter', async () => {
    jest
      .spyOn(fightMockAdapter, 'isDead')
      .mockResolvedValueOnce(ok({ isDead: true }));
    await firstValueFrom(
      combatSaga
        .fighterRetaliate(
          of(new FighterRetaliationEvent({ fight: mockFight, logId })),
        )
        .pipe(afterCommandTest()),
    );

    expect(fightMockAdapter.isDead).toBeCalledWith(mockFight.defender.id);
    expect(eventBusMock.publish).toBeCalledWith(
      new CombatEndedEvent({
        fight: reverseFight(mockFight),
        outcome: Outcome.LOSS,
        logId,
      }),
    );
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
