import { ICommand } from '@nestjs/cqrs';
import { Fight } from '../../../domain/fight/fight.type';
import { Fighter } from '../../../domain/fight/fighter.entity';

export class StartCombatCommand<X extends Fighter, Y extends Fighter>
  implements ICommand
{
  constructor(public readonly payload: Fight<X, Y>) {}
}
