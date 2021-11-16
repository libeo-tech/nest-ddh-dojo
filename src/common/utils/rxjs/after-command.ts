import { pipe } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AwaitedCommand } from '../../core/commands/awaited-command';

export function afterCommand<C extends AwaitedCommand>(
  callback: (command: C) => void,
) {
  return pipe(
    tap(async (awaitedCommand: C) => {
      await awaitedCommand.await();
      callback(awaitedCommand);
    }),
  );
}
