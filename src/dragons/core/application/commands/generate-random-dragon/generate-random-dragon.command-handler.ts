import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePort } from '../../../../../common/core/domain/base.ports';
import { withSpan } from '../../../../../common/utils/trace/honeycomb';
import { Dragon } from '../../../domain/dragon.entity';
import { dragonEntityFactory } from '../../../domain/dragon.entity-factory';
import { GenerateRandomDragonCommand } from './generate-random-dragon.command';

@CommandHandler(GenerateRandomDragonCommand)
export class GenerateRandomDragonCommandHandler
  implements ICommandHandler<GenerateRandomDragonCommand>
{
  constructor(
    @Inject(Dragon) private readonly dragonPorts: CreatePort<Dragon>,
  ) {}

  private readonly logger = new Logger(GenerateRandomDragonCommandHandler.name);

  @withSpan()
  public async execute(): Promise<void> {
    this.logger.log(`> GenerateRandomDragonCommand`);

    const randomDragon = dragonEntityFactory();
    await this.dragonPorts.create(randomDragon);
  }
}
