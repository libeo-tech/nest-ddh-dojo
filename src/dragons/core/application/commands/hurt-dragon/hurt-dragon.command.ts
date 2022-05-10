import { ICommand } from '@nestjs/cqrs';
import { Result } from 'neverthrow';
import { Damage } from '../../../../../combat/core/domain/attack/damage.object-value';
import { Fighter } from '../../../../../combat/core/domain/fight/fighter.entity';
import { Dragon } from '../../../domain/dragon.entity';
import { DragonNotFoundError } from '../../../domain/dragon.error';

export class HurtDragonCommand implements ICommand {
  constructor(
    public readonly payload: {
      dragonId: Dragon['id'];
      damage: Damage<Fighter>;
    },
  ) {}
}

export type HurtDragonCommandResult = Result<void, DragonNotFoundError>;
