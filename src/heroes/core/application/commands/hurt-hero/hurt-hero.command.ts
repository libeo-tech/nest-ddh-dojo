import { ICommand } from '@nestjs/cqrs';
import { Hero } from '../../../domain/hero.entity';
import { Damage } from '../../../../../combat/core/domain/attack/damage.object-value';
import { Fighter } from '../../../../../combat/core/domain/fight/fighter.entity';

export class HurtHeroCommand implements ICommand {
  constructor(
    public readonly payload: {
      heroId: Hero['id'];
      damage: Damage<Fighter>;
    },
  ) {}
}
