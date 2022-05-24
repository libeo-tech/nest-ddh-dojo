import { EventBus, IEvent } from '@nestjs/cqrs';
import { Observable, pipe, UnaryFunction } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AwaitedCommand } from '../../core/commands/awaited-command';

export function afterCommand<C extends AwaitedCommand>(
  eventBus: EventBus,
  callback: (command: C) => Promise<IEvent>,
): UnaryFunction<Observable<C>, Observable<C>> {
  return pipe(
    tap(async (awaitedCommand: C) => {
      await awaitedCommand.await();
      const event = await callback(awaitedCommand);
      await eventBus.publish(event);
    }),
  );
}
