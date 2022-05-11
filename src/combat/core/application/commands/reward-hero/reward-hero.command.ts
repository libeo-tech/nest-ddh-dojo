import { ICommand } from '@nestjs/cqrs';
import { Result } from 'neverthrow';
import { UnknownApplicationError } from '../../../../../common/core/domain/base.error';
import { Dragon } from '../../../../../dragons/core/domain/dragon.entity';
import { DragonNotFoundError } from '../../../../../dragons/core/domain/dragon.error';
import { Hero } from '../../../../../heroes/core/domain/hero.entity';
import { HeroNotFoundError } from '../../../../../heroes/core/domain/hero.error';

export class RewardHeroCommand implements ICommand {
  constructor(
    public readonly payload: {
      heroId: Hero['id'];
      dragonId: Dragon['id'];
    },
  ) {}
}

export type RewardHeroCommandResult = Result<
  void,
  DragonNotFoundError | HeroNotFoundError | UnknownApplicationError
>;
