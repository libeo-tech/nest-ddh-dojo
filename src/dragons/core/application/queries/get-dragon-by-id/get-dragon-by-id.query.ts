import { IQuery, IQueryResult } from '@nestjs/cqrs';
import { Dragon } from '../../../domain/dragon.entity';

export class GetDragonByIdQuery implements IQuery {
  constructor(
    public readonly payload: {
      dragonId: Dragon['id'];
    },
  ) {}
}

export class GetDragonByIdQueryResult implements IQueryResult {
  constructor(public readonly dragon: Dragon) {}
}
