import { ICommand } from '@nestjs/cqrs';
import { Item } from '../../../../../items/core/domain/item.entity';
import { Hero } from '../../../domain/hero.entity';

export class EquipItemCommand implements ICommand {
  constructor(
    public readonly payload: {
      heroId: Hero['id'];
      itemId: Item['id'];
    },
  ) {}
}
