import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePort } from '../../../../../common/core/domain/base.ports';
import { withSpan } from '../../../../../common/utils/trace/honeycomb';
import { Item, ItemWithOwner } from '../../../domain/item.entity';
import { itemEntityFactory } from '../../../domain/item.entity-factory';
import { ItemWithOwnerPorts } from '../../ports/item-with-owner.ports';
import { GenerateRandomItemCommand } from './generate-random-item.command';

@CommandHandler(GenerateRandomItemCommand)
export class GenerateRandomItemCommandHandler
  implements ICommandHandler<GenerateRandomItemCommand>
{
  constructor(
    @Inject(Item) private readonly itemPorts: CreatePort<Item>,
    @Inject(ItemWithOwner)
    private readonly itemWithOwnerPorts: Pick<
      ItemWithOwnerPorts,
      'attributeOwnerOfItem'
    >,
  ) {}

  private readonly logger = new Logger(GenerateRandomItemCommandHandler.name);

  @withSpan()
  public async execute({ payload }: GenerateRandomItemCommand): Promise<void> {
    this.logger.log(`> GenerateRandomItemCommand`);
    const { ownerId } = payload;

    const randomItem = itemEntityFactory();
    const item = await this.itemPorts.create(randomItem);
    await this.itemWithOwnerPorts.attributeOwnerOfItem(item.id, ownerId);
  }
}
