import { pipe } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { AwaitedCommand } from '../../core/commands/awaited-command';

export function afterCommandTest<C extends AwaitedCommand>() {
  return pipe(
    map((awaitedCommand: C) => {
      awaitedCommand.end();
    }),
    delay(0),
  );
}
