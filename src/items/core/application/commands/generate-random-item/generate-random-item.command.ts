import { ICommand } from '@nestjs/cqrs';
import { Hero } from '../../../../../heroes/core/domain/hero.entity';

export class GenerateRandomItemCommand implements ICommand {
  constructor(
    public readonly payload: {
      ownerId?: Hero['id'];
    },
  ) {}
}
