import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ok } from 'neverthrow';
import { CreatePort } from '../../../../../common/core/domain/base.ports';
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

  private readonly logger = new Logger(GenerateNewDragonCommandHandler.name);

  public async execute({
    payload,
  }: GenerateNewDragonCommand): Promise<GenerateNewDragonCommandResult> {
    this.logger.log(`> GenerateNewDragonCommand`);

    const newDragon = dragonEntityFactory(payload);
    const dragon = await this.dragonPorts.create(newDragon);
    return ok(dragon);
  }
}
