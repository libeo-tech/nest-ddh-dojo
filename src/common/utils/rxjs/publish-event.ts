import { IEvent } from '@nestjs/cqrs';
import { map, Observable, pipe, UnaryFunction } from 'rxjs';
import { PublishEventCommand } from '../../core/commands/publish-event.command';

export function publishEvent<T extends unknown, E extends IEvent>(
  project: (value: T, index: number) => E,
): UnaryFunction<Observable<T>, Observable<PublishEventCommand<E>>> {
  return pipe(
    map(project),
    map((event) => {
      return new PublishEventCommand(event);
    }),
  );
}
