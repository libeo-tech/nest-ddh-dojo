import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { withSpan } from '../../../../../common/utils/trace/honeycomb';
import { dragonEntityFactory } from '../../../domain/dragon.entity-factory';
import { DragonPorts } from '../../ports/dragon.ports';
import { GenerateRandomDragonCommand } from './generate-random-dragon.command';

@CommandHandler(GenerateRandomDragonCommand)
export class GenerateRandomDragonCommandHandler
  implements ICommandHandler<GenerateRandomDragonCommand>
{
  constructor(private readonly dragonPorts: DragonPorts) {}

  private readonly logger = new Logger(GenerateRandomDragonCommandHandler.name);

  @withSpan()
  public async execute(): Promise<void> {
    this.logger.log(`> GenerateRandomDragonCommand`);

    const randomDragon = dragonEntityFactory();
    await this.dragonPorts.create(randomDragon);
  }
}
