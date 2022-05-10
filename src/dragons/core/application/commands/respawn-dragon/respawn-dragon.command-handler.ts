import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ok, err } from 'neverthrow';
import {
  GetByIdPort,
  UpdatePort,
} from '../../../../../common/core/domain/base.ports';
import { LogPayloadAndResult } from '../../../../../common/utils/handler-decorators/log-payload-and-result.decorator';
import { WrapInTryCatchWithUnknownApplicationError } from '../../../../../common/utils/handler-decorators/wrap-in-try-catch-with-unknown-application-error.decorator';
import { Dragon, getDragonMaxHp } from '../../../domain/dragon.entity';
import { DragonNotFoundError } from '../../../domain/dragon.error';
import {
  RespawnDragonCommand,
  RespawnDragonCommandResult,
} from './respawn-dragon.command';

@CommandHandler(RespawnDragonCommand)
export class RespawnDragonCommandHandler
  implements ICommandHandler<RespawnDragonCommand>
{
  constructor(
    @Inject(Dragon)
    private readonly dragonPorts: GetByIdPort<Dragon> & UpdatePort<Dragon>,
  ) {}

  @WrapInTryCatchWithUnknownApplicationError('DragonModule')
  @LogPayloadAndResult('DragonModule')
  public async execute({
    payload,
  }: RespawnDragonCommand): Promise<RespawnDragonCommandResult> {
    const { dragonId } = payload;

    const dragon = await this.dragonPorts.getById(dragonId);
    if (!dragon) {
      return err(new DragonNotFoundError(dragonId));
    }

    await this.dragonPorts.update(dragonId, {
      currentHp: getDragonMaxHp(dragon.level),
    });

    return ok(void 0);
  }
}
