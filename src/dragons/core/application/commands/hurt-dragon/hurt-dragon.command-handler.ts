import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { isNumberObject } from 'util/types';
import {
  GetByIdPort,
  UpdatePort,
} from '../../../../../common/core/ports/base.ports';
import { Dragon } from '../../../domain/dragon.entity';
import { DragonNotFoundError } from '../../../domain/dragon.error';
import { DragonGotHurtEvent } from '../../../domain/dragon.events';
import { HurtDragonCommand } from './hurt-dragon.command';

@CommandHandler(HurtDragonCommand)
export class HurtDragonCommandHandler
  implements ICommandHandler<HurtDragonCommand>
{
  constructor(
    @Inject(Dragon)
    private readonly dragonPorts: GetByIdPort<Dragon> & UpdatePort<Dragon>,
    private readonly eventBus: EventBus,
  ) {}

  private readonly logger = new Logger(HurtDragonCommandHandler.name);

  public async execute({ payload }: HurtDragonCommand): Promise<void> {
    this.logger.log(`> HurtDragonCommand: ${JSON.stringify(payload)}`);
    const { heroId, dragonId, damage } = payload;

    const dragon = await this.dragonPorts.getById(dragonId);
    if (!dragon) {
      throw new DragonNotFoundError(dragonId);
    }

    await this.dragonPorts.update(dragonId, {
      currentHp: dragon.currentHp - damage,
    });
    await this.eventBus.publish(
      new DragonGotHurtEvent({ heroId, dragonId, damage }),
    );
  }
}
