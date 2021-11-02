import { TestScheduler } from 'rxjs/testing';
import { generateRandomNumber } from '../../../../common/utils/random/random-number';
import { Dragon } from '../../../../dragons/core/domain/dragon.entity';
import { dragonEntityFactory } from '../../../../dragons/core/domain/dragon.entity-factory';
import { DragonSlainEvent } from '../../../../dragons/core/domain/dragon.events';
import { Hero } from '../../../../heroes/core/domain/hero.entity';
import { heroFixtureFactory } from '../../../../heroes/core/domain/hero.fixture-factory';
import { GenerateRandomItemCommand } from '../commands/generate-random-item/generate-random-item.command';
import { ItemSagas } from './item.saga';

describe('item saga', () => {
  let testScheduler: TestScheduler;
  const hero: Hero = heroFixtureFactory();
  const dragon: Dragon = dragonEntityFactory();

  const saga = new ItemSagas();

  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) =>
      expect(actual).toStrictEqual(expected),
    );
  });

  it('should generate a random item when a dragon is slain', () => {
    const xpGain = generateRandomNumber(1, 100);
    testScheduler.run(({ hot, expectObservable }) => {
      const events$ = hot('-s-s-|', {
        s: new DragonSlainEvent({
          heroId: hero.id,
          dragonId: dragon.id,
          reward: { xpGain },
        }),
      });

      const output$ = saga.dragonSlain(events$);
      expectObservable(output$).toBe('-x-x-|', {
        x: new GenerateRandomItemCommand({
          ownerId: hero.id,
        }),
      });
    });
  });
});
