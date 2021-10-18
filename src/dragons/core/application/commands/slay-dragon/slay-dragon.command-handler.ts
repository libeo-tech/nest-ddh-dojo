import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { DragonSlainEvent } from '../../../domain/dragon.events';
import { DragonPorts } from '../../ports/dragon.ports';
import { SlayDragonCommand } from './slay-dragon.command';

@CommandHandler(SlayDragonCommand)
export class SlayDragonCommandHandler
  implements ICommandHandler<SlayDragonCommand>
{
  constructor(
    private readonly dragonPorts: DragonPorts,
    private readonly eventBus: EventBus,
  ) {}

  private readonly logger = new Logger(SlayDragonCommandHandler.name);

  public async execute({ payload }: SlayDragonCommand): Promise<void> {
    this.logger.log(`> SlayDragonCommand: ${JSON.stringify(payload)}`);
    const { heroId, dragonId } = payload;

    await this.dragonPorts.deleteDragon(dragonId);
    await this.eventBus.publish(new DragonSlainEvent(heroId, dragonId));
  }
}
