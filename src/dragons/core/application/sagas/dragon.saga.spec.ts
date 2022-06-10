import { TestScheduler } from 'rxjs/testing';
import { testSchedulerFactory } from '../../../../common/utils/test/test-scheduler.factory';
import { Dragon } from '../../domain/dragon.entity';
import { DragonSlainEvent } from '../../domain/dragon.events';
import { RespawnDragonCommand } from '../commands/respawn-dragon/respawn-dragon.command';
import { DragonSagas } from './dragon.saga';

describe('dragon sagas', () => {
  const dragonSaga = new DragonSagas();
  let testScheduler: TestScheduler;

  beforeEach(() => {
    testScheduler = testSchedulerFactory();
  });

  it('should respawn a dragon after it has been slain', async () => {
    const payload = { dragonId: 'dragonId' as Dragon['id'] };
    testScheduler.run(({ hot, expectObservable }) => {
      const events$ = hot('-s 60s -|', {
        s: new DragonSlainEvent(payload),
      });

      const output$ = dragonSaga.respawnDragon(events$);
      expectObservable(output$).toBe('- 60s r-|', {
        r: new RespawnDragonCommand(payload),
      });
    });
  });
});
