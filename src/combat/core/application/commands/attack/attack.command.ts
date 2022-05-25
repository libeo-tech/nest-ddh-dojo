import { ICommand } from '@nestjs/cqrs';
import { Result } from 'neverthrow';
import { UnknownApplicationError } from '../../../../../common/core/domain/base.error';
import { CombatLog } from '../../../domain/combat-log/combat-log.entity';
import { FighterNotFoundError } from '../../../domain/fight/fight.error';
import { Fight } from '../../../domain/fight/fight.type';
import { Fighter } from '../../../domain/fight/fighter.entity';

export class AttackCommand<X extends Fighter, Y extends Fighter>
  implements ICommand
{
  constructor(
    public readonly payload: {
      fight: Fight<X, Y>;
      logId: CombatLog<X, Y>['id'];
      isRetaliate: boolean;
    },
  ) {}
}

export type AttackCommandResult = Result<
  { isDead: boolean },
  FighterNotFoundError | UnknownApplicationError
>;
