import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ok } from 'neverthrow';
import { CreatePort } from '../../../../../common/core/domain/base.ports';
import { LogPayloadAndResult } from '../../../../../common/utils/handler-decorators/log-payload-and-result.decorator';
import { WrapInTryCatchWithUnknownApplicationError } from '../../../../../common/utils/handler-decorators/wrap-in-try-catch-with-unknown-application-error.decorator';
import { Dragon } from '../../../domain/dragon.entity';
import { dragonEntityFactory } from '../../../domain/dragon.entity-factory';
import {
  GenerateNewDragonCommand,
  GenerateNewDragonCommandResult,
} from './generate-new-dragon.command';

@CommandHandler(GenerateNewDragonCommand)
export class GenerateNewDragonCommandHandler
  implements ICommandHandler<GenerateNewDragonCommand>
{
  constructor(
    @Inject(Dragon) private readonly dragonPorts: CreatePort<Dragon>,
  ) {}

  @WrapInTryCatchWithUnknownApplicationError('DragonModule')
  @LogPayloadAndResult('DragonModule')
  public async execute({
    payload,
  }: GenerateNewDragonCommand): Promise<GenerateNewDragonCommandResult> {
    const newDragon = dragonEntityFactory(payload);
    const dragon = await this.dragonPorts.create(newDragon);
    return ok(dragon);
  }
}
