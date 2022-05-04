import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdatePort } from '../../../../../common/core/domain/base.ports';
import { Hero } from '../../../domain/hero.entity';
import { EquipItemCommand } from './equip-item.command';

@CommandHandler(EquipItemCommand)
export class EquipItemCommandHandler
  implements ICommandHandler<EquipItemCommand>
{
  constructor(
    @Inject(Hero)
    private readonly heroPorts: UpdatePort<Hero>,
  ) {}

  private readonly logger = new Logger(EquipItemCommandHandler.name);

  public async execute({ payload }: EquipItemCommand): Promise<void> {
    this.logger.log(`> EquipItemCommand: ${JSON.stringify(payload)}`);
    const { heroId, itemId } = payload;

    await this.heroPorts.update(heroId, { equippedItem: itemId });
  }
}
