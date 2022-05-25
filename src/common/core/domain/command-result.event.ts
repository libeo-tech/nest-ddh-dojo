import { ICommand, IEvent } from '@nestjs/cqrs';
import { Result } from 'neverthrow';

export class CommandResultEvent<
  C extends ICommand,
  R extends Result<unknown, unknown>,
> implements IEvent
{
  constructor(public readonly command: C, public readonly result: R) {}
}
