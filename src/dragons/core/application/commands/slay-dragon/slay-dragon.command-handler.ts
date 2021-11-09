import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import {
  DeletePort,
  GetByIdPort,
} from '../../../../../common/core/ports/base.ports';
import { withSpan } from '../../../../../common/utils/trace/honeycomb';
import { Dragon } from '../../../domain/dragon.entity';
import { DragonNotFoundError } from '../../../domain/dragon.error';
import { DragonSlainEvent } from '../../../domain/dragon.events';
import { rewardFactory } from '../../../domain/reward/reward';
import { SlayDragonCommand } from './slay-dragon.command';

@CommandHandler(SlayDragonCommand)
export class SlayDragonCommandHandler
  implements ICommandHandler<SlayDragonCommand>
{
  constructor(
    @Inject(Dragon)
    private readonly dragonPorts: GetByIdPort<Dragon> & DeletePort<Dragon>,
    private readonly eventBus: EventBus,
  ) {}

  private readonly logger = new Logger(SlayDragonCommandHandler.name);

  @withSpan()
  public async execute({ payload }: SlayDragonCommand): Promise<void> {
    this.logger.log(`> SlayDragonCommand: ${JSON.stringify(payload)}`);
    const { heroId, dragonId } = payload;

    const dragon = await this.dragonPorts.getById(dragonId);
    if (!dragon) {
      throw new DragonNotFoundError(dragonId);
    }

    const reward = rewardFactory(dragon.level);
    await this.dragonPorts.delete(dragonId);
    await this.eventBus.publish(
      new DragonSlainEvent({ heroId, dragonId, reward }),
    );
  }
}
