import { IQuery } from '@nestjs/cqrs';
import { Result } from 'neverthrow';
import { UnknownApplicationError } from '../../../../../common/core/domain/base.error';
import { Hero } from '../../../domain/hero.entity';
import { HeroNotFoundError } from '../../../domain/hero.error';

export class GetHeroByIdQuery implements IQuery {
  constructor(
    public readonly payload: {
      heroId: Hero['id'];
    },
  ) {}
}

export type GetHeroByIdQueryResult = Result<
  { hero: Hero },
  HeroNotFoundError | UnknownApplicationError
>;
