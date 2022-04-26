import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import {
  GetByIdPort,
  UpdatePort,
} from '../../../../../common/core/domain/base.ports';
import { withSpan } from '../../../../../common/utils/trace/honeycomb';
import { Dragon } from '../../../domain/dragon.entity';
import { DragonNotFoundError } from '../../../domain/dragon.error';
import { DragonSlainEvent } from '../../../domain/dragon.events';
import { HurtDragonCommand } from './hurt-dragon.command';

@CommandHandler(HurtDragonCommand)
export class HurtDragonCommandHandler
  implements ICommandHandler<HurtDragonCommand>
{
  constructor(
    @Inject(Dragon)
    private readonly dragonPorts: GetByIdPort<Dragon> & UpdatePort<Dragon>,
    private eventBus: EventBus,
  ) {}

  private readonly logger = new Logger(HurtDragonCommandHandler.name);

  @withSpan()
  public async execute({ payload }: HurtDragonCommand): Promise<void> {
    this.logger.log(`> HurtDragonCommand: ${JSON.stringify(payload)}`);
    const { dragonId, damage } = payload;

    const dragon = await this.dragonPorts.getById(dragonId);
    if (!dragon) {
      throw new DragonNotFoundError(dragonId);
    }

    const newHp = dragon.currentHp - damage.value;
    await this.dragonPorts.update(dragonId, {
      currentHp: newHp,
    });

    if (newHp <= 0 && damage.source) {
      await this.eventBus.publish(new DragonSlainEvent({ dragonId }));
    }
  }
}
