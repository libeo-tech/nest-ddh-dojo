import { ICommand } from '@nestjs/cqrs';
import { Dragon } from '../../../../../dragons/core/domain/dragon.entity';
import { Hero } from '../../../domain/hero.entity';

export class AttackCommand implements ICommand {
  constructor(
    public readonly payload: {
      heroId: Hero['id'];
      targetId: Dragon['id'];
    },
  ) {}
}
