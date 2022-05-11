import { Inject } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { err, ok } from 'neverthrow';
import {
  GetByIdPort,
  UpdatePort,
} from '../../../../../common/core/domain/base.ports';
import { LogPayloadAndResult } from '../../../../../common/utils/handler-decorators/log-payload-and-result.decorator';
import { WrapInTryCatchWithUnknownApplicationError } from '../../../../../common/utils/handler-decorators/wrap-in-try-catch-with-unknown-application-error.decorator';
import { Dragon } from '../../../domain/dragon.entity';
import { DragonNotFoundError } from '../../../domain/dragon.error';
import { DragonSlainEvent } from '../../../domain/dragon.events';
import {
  HurtDragonCommand,
  HurtDragonCommandResult,
} from './hurt-dragon.command';

@CommandHandler(HurtDragonCommand)
export class HurtDragonCommandHandler
  implements ICommandHandler<HurtDragonCommand>
{
  constructor(
    @Inject(Dragon)
    private readonly dragonPorts: GetByIdPort<Dragon> & UpdatePort<Dragon>,
    private eventBus: EventBus,
  ) {}

  @WrapInTryCatchWithUnknownApplicationError('DragonModule')
  @LogPayloadAndResult('DragonModule')
  public async execute({
    payload,
  }: HurtDragonCommand): Promise<HurtDragonCommandResult> {
    const { dragonId, damage } = payload;

    const dragon = await this.dragonPorts.getById(dragonId);
    if (!dragon) {
      return err(new DragonNotFoundError(dragonId));
    }

    const newHp = dragon.currentHp - damage.value;
    await this.dragonPorts.update(dragonId, {
      currentHp: newHp,
    });

    if (newHp <= 0 && damage.source) {
      await this.eventBus.publish(new DragonSlainEvent({ dragonId }));
    }

    return ok(void 0);
  }
}
