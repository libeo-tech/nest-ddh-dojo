import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { DragonNotFoundError } from '../../../domain/dragon.error';
import { DragonSlainEvent } from '../../../domain/dragon.events';
import { Reward, rewardFactory } from '../../../domain/reward/reward';
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

    const dragon = await this.dragonPorts.getDragonById(dragonId);
    if (!dragon) {
      throw new DragonNotFoundError(dragonId);
    }

    const reward = rewardFactory(dragon.level);
    await this.dragonPorts.deleteDragon(dragonId);
    await this.eventBus.publish(
      new DragonSlainEvent({ heroId, dragonId, reward }),
    );
  }
}
