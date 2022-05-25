import { ICommand, IEvent } from '@nestjs/cqrs';

export class PublishEventCommand<E extends IEvent> implements ICommand {
  constructor(public readonly event: E) {}
}
