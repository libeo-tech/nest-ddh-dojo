import { TestScheduler } from 'rxjs/testing';
import { generateRandomNumber } from '../../../../common/utils/random/random-number';
import { DragonGotHurtEvent } from '../../../../dragons/core/domain/dragon.events';
import { DragonSagas } from './dragon.saga';
import { DragonMockAdapter } from '../../../infrastructure/mock/dragon.mock-adapter';
import { HeroAttackedTargetEvent } from '../../../../heroes/core/domain/attack/attack.event';
import { HurtDragonCommand } from '../commands/hurt-dragon/hurt-dragon.command';
import { SlayDragonCommand } from '../commands/slay-dragon/slay-dragon.command';
import { heroFixtureFactory } from '../../../../heroes/core/domain/hero.fixture-factory';
import { lastValueFrom, of } from 'rxjs';

describe('dragon saga', () => {
  let testScheduler: TestScheduler;
  const { id: heroId } = heroFixtureFactory();

  const dragonMockAdapter = new DragonMockAdapter();
  const saga = new DragonSagas(dragonMockAdapter);

  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) =>
      expect(actual).toStrictEqual(expected),
    );
  });

  it('should hurt the dragon when it gets attacked', async () => {
    const dragon = await dragonMockAdapter.create({});
    const attackValue = generateRandomNumber(1, 100);

    testScheduler.run(({ hot, expectObservable }) => {
      const events$ = hot('-a-a-|', {
        a: new HeroAttackedTargetEvent({
          heroId,
          targetId: dragon.id,
          attackValue,
        }),
      });

      const output$ = saga.dragonIsAttacked(events$);
      expectObservable(output$).toBe('-h-h-|', {
        h: new HurtDragonCommand({
          heroId,
          dragonId: dragon.id,
          damage: attackValue,
        }),
      });
    });
  });

  it('should slay the dragon if it loses too much hp', async () => {
    const { id: dragonId, currentHp } = await dragonMockAdapter.create({
      currentHp: 0,
    });

    const observable = saga.dragonIsSlain(
      of(
        new DragonGotHurtEvent({
          heroId,
          dragonId,
          damage: currentHp,
        }),
      ),
    );

    const result = await lastValueFrom(observable);
    expect(result).toEqual(
      new SlayDragonCommand({
        heroId,
        dragonId,
      }),
    );
    await dragonMockAdapter.delete(dragonId);
  });
});
