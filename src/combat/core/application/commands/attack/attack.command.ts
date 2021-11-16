import { ICommand } from '@nestjs/cqrs';
import { CombatLog } from '../../../domain/combat-log/combat-log.entity';
import { Fight } from '../../../domain/fight/fight.type';
import { Fighter } from '../../../domain/fight/fighter.entity';

export class AttackCommand<X extends Fighter, Y extends Fighter>
  implements ICommand
{
  constructor(
    public readonly payload: {
      fight: Fight<X, Y>;
      logId: CombatLog<X, Y>['id'];
    },
  ) {}
}
