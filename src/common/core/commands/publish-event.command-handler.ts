import {
  CommandHandler,
  EventBus,
  ICommandHandler,
  IEvent,
} from '@nestjs/cqrs';
import { PublishEventCommand } from './publish-event.command';

@CommandHandler(PublishEventCommand)
export class PublishEventCommandHandler<E extends IEvent>
  implements ICommandHandler<PublishEventCommand<E>>
{
  constructor(private readonly eventBus: EventBus) {}

  public async execute({ event }: PublishEventCommand<E>): Promise<void> {
    await this.eventBus.publish(event);
  }
}
