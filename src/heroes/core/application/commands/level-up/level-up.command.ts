import { ICommand } from '@nestjs/cqrs';
import { Result } from 'neverthrow';
import { UnknownApplicationError } from '../../../../../common/core/domain/base.error';
import { Hero } from '../../../domain/hero.entity';
import {
  HeroDoesNotHaveEnoughXp,
  HeroNotFoundError,
} from '../../../domain/hero.error';

export class LevelUpCommand implements ICommand {
  constructor(
    public readonly payload: {
      heroId: Hero['id'];
    },
  ) {}
}

export type LevelUpCommandResult = Result<
  void,
  HeroNotFoundError | HeroDoesNotHaveEnoughXp | UnknownApplicationError
>;
