import { IQuery } from '@nestjs/cqrs';
import { Result } from 'neverthrow';
import { Dragon } from '../../../domain/dragon.entity';
import { DragonNotFoundError } from '../../../domain/dragon.error';

export class GetDragonByIdQuery implements IQuery {
  constructor(
    public readonly payload: {
      dragonId: Dragon['id'];
    },
  ) {}
}

export type GetDragonByIdQueryResult = Result<
  { dragon: Dragon },
  DragonNotFoundError
>;
