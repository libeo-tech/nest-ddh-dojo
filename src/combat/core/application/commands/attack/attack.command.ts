import { Result } from 'neverthrow';
import { AwaitedCommand } from '../../../../../common/core/commands/awaited-command';
import { UnknownApplicationError } from '../../../../../common/core/domain/base.error';
import { CombatLog } from '../../../domain/combat-log/combat-log.entity';
import { FighterNotFoundError } from '../../../domain/fight/fight.error';
import { Fight } from '../../../domain/fight/fight.type';
import { Fighter } from '../../../domain/fight/fighter.entity';

export class AttackCommand<
  X extends Fighter,
  Y extends Fighter,
> extends AwaitedCommand {
  constructor(
    public readonly payload: {
      fight: Fight<X, Y>;
      logId: CombatLog<X, Y>['id'];
    },
  ) {
    super();
  }
}

export type AttackCommandResult = Result<
  void,
  FighterNotFoundError | UnknownApplicationError
>;
