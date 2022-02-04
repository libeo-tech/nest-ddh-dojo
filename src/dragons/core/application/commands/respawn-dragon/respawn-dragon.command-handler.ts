import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  GetByIdPort,
  UpdatePort,
} from '../../../../../common/core/ports/base.ports';
import { withSpan } from '../../../../../common/utils/trace/honeycomb';
import { Dragon, getDragonMaxHp } from '../../../domain/dragon.entity';
import { DragonNotFoundError } from '../../../domain/dragon.error';
import { RespawnDragonCommand } from './respawn-dragon.command';

@CommandHandler(RespawnDragonCommand)
export class RespawnDragonCommandHandler
  implements ICommandHandler<RespawnDragonCommand>
{
  constructor(
    @Inject(Dragon)
    private readonly dragonPorts: GetByIdPort<Dragon> & UpdatePort<Dragon>,
  ) {}

  private readonly logger = new Logger(RespawnDragonCommandHandler.name);

  @withSpan()
  public async execute({ payload }: RespawnDragonCommand): Promise<void> {
    this.logger.log(`> RespawnDragonCommand: ${JSON.stringify(payload)}`);
    const { dragonId } = payload;

    const dragon = await this.dragonPorts.getById(dragonId);
    if (!dragon) {
      throw new DragonNotFoundError(dragonId);
    }

    await this.dragonPorts.update(dragonId, {
      currentHp: getDragonMaxHp(dragon.level),
    });
  }
}
