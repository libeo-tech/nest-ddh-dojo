import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePort } from '../../../../../common/core/domain/base.ports';
import { withSpan } from '../../../../../common/utils/trace/honeycomb';
import { Dragon } from '../../../domain/dragon.entity';
import { dragonEntityFactory } from '../../../domain/dragon.entity-factory';
import { GenerateNewDragonCommand } from './generate-new-dragon.command';

@CommandHandler(GenerateNewDragonCommand)
export class GenerateNewDragonCommandHandler
  implements ICommandHandler<GenerateNewDragonCommand>
{
  constructor(
    @Inject(Dragon) private readonly dragonPorts: CreatePort<Dragon>,
  ) {}

  private readonly logger = new Logger(GenerateNewDragonCommandHandler.name);

  @withSpan()
  public async execute({ payload }: GenerateNewDragonCommand): Promise<void> {
    this.logger.log(`> GenerateNewDragonCommand`);

    const newDragon = dragonEntityFactory(payload);
    await this.dragonPorts.create(newDragon);
  }
}
