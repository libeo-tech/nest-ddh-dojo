import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { itemEntityFactory } from '../../../domain/item.entity-factory';
import { ItemPorts } from '../../ports/item.ports';
import { GenerateRandomItemCommand } from './generate-random-item.command';

@CommandHandler(GenerateRandomItemCommand)
export class GenerateRandomItemCommandHandler
  implements ICommandHandler<GenerateRandomItemCommand>
{
  constructor(private readonly itemPorts: ItemPorts) {}

  private readonly logger = new Logger(GenerateRandomItemCommandHandler.name);

  public async execute({ payload }: GenerateRandomItemCommand): Promise<void> {
    this.logger.log(`> GenerateRandomItemCommand`);
    const { ownerId } = payload;

    const randomItem = itemEntityFactory();
    const item = await this.itemPorts.createItem(randomItem);
    await this.itemPorts.attributeOwnerOfItem(item.id, ownerId);
  }
}
