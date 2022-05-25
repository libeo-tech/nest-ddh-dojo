import { Type } from '@nestjs/common';
import { ICommand, IEvent, ofType } from '@nestjs/cqrs';
import { Result } from 'neverthrow';
import { filter, Observable, pipe } from 'rxjs';
import { CommandResultEvent } from '../../core/domain/command-result.event';

export function afterCommand<
  C extends ICommand,
  R extends Result<unknown, unknown>,
>(
  CommandType: Type<C>,
): (source: Observable<C>) => Observable<CommandResultEvent<C, R>> {
  return pipe(
    ofType<IEvent, CommandResultEvent<C, R>>(CommandResultEvent),
    filter(({ command }) => {
      return command instanceof CommandType;
    }),
  );
}
