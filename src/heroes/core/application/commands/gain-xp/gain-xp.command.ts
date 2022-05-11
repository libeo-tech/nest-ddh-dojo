import { ICommand } from '@nestjs/cqrs';
import { Result } from 'neverthrow';
import { UnknownApplicationError } from '../../../../../common/core/domain/base.error';
import { Hero } from '../../../../infrastructure/typeorm/hero.orm-entity';
import { HeroNotFoundError } from '../../../domain/hero.error';

export class GainXpCommand implements ICommand {
  constructor(
    public readonly payload: {
      heroId: Hero['id'];
      xpGain: Hero['xp'];
    },
  ) {}
}

export type GainXpCommandResult = Result<
  void,
  HeroNotFoundError | UnknownApplicationError
>;
