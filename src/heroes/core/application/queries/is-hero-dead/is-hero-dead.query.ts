import { IQuery } from '@nestjs/cqrs';
import { Result } from 'neverthrow';
import { UnknownApplicationError } from '../../../../../common/core/domain/base.error';
import { Hero } from '../../../domain/hero.entity';
import { HeroNotFoundError } from '../../../domain/hero.error';

export class IsHeroDeadQuery implements IQuery {
  constructor(
    public readonly payload: {
      heroId: Hero['id'];
    },
  ) {}
}

export type IsHeroDeadQueryResult = Result<
  { isDead: boolean },
  HeroNotFoundError | UnknownApplicationError
>;
