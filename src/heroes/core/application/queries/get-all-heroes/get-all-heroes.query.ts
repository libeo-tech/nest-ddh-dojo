import { IQuery } from '@nestjs/cqrs';
import { Result } from 'neverthrow';
import { UnknownApplicationError } from '../../../../../common/core/domain/base.error';
import { Hero } from '../../../domain/hero.entity';

export class GetAllHeroesQuery implements IQuery {}

export type GetAllHeroesQueryResult = Result<
  { heroes: Hero[] },
  UnknownApplicationError
>;
