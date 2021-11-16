import { ICommand } from '@nestjs/cqrs';
import { Damage } from '../../../../../combat/core/domain/attack/damage.object-value';
import { Fighter } from '../../../../../combat/core/domain/fight/fighter.entity';
import { Dragon } from '../../../domain/dragon.entity';

export class HurtDragonCommand implements ICommand {
  constructor(
    public readonly payload: {
      dragonId: Dragon['id'];
      damage: Damage<Fighter>;
    },
  ) {}
}
