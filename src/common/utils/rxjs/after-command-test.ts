import { Observable, pipe, UnaryFunction } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { AwaitedCommand } from '../../core/commands/awaited-command';

export function afterCommandTest<C extends AwaitedCommand>(): UnaryFunction<
  Observable<C>,
  Observable<void>
> {
  return pipe(
    map((awaitedCommand: C) => {
      awaitedCommand.end();
    }),
    delay(0),
  );
}
