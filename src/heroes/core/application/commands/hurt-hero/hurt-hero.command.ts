import { ICommand } from '@nestjs/cqrs';
import { Hero } from '../../../domain/hero.entity';
import { Damage } from '../../../../../combat/core/domain/attack/damage.object-value';
import { Fighter } from '../../../../../combat/core/domain/fight/fighter.entity';
import { Result } from 'neverthrow';
import { HeroNotFoundError } from '../../../domain/hero.error';
import { UnknownApplicationError } from '../../../../../common/core/domain/base.error';

export class HurtHeroCommand implements ICommand {
  constructor(
    public readonly payload: {
      heroId: Hero['id'];
      damage: Damage<Fighter>;
    },
  ) {}
}

export type HurtHeroCommandResult = Result<
  void,
  HeroNotFoundError | UnknownApplicationError
>;
