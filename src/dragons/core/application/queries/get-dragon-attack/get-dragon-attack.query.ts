import { IQuery } from '@nestjs/cqrs';
import { Result } from 'neverthrow';
import { UnknownApplicationError } from '../../../../../common/core/domain/base.error';
import { Dragon } from '../../../domain/dragon.entity';
import { DragonNotFoundError } from '../../../domain/dragon.error';

export class GetDragonAttackQuery implements IQuery {
  constructor(
    public readonly payload: {
      dragonId: Dragon['id'];
    },
  ) {}
}

export type GetDragonAttackQueryResult = Result<
  { attackValue: number },
  DragonNotFoundError | UnknownApplicationError
>;
