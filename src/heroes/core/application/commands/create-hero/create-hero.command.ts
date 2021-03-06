import { ICommand } from '@nestjs/cqrs';
import { Result } from 'neverthrow';
import { UnknownApplicationError } from '../../../../../common/core/domain/base.error';
import { Hero } from '../../../domain/hero.entity';

export class CreateHeroCommand implements ICommand {
  constructor(
    public readonly payload: {
      name: Hero['name'];
    },
  ) {}
}

export type CreateHeroCommandResult = Result<Hero, UnknownApplicationError>;
