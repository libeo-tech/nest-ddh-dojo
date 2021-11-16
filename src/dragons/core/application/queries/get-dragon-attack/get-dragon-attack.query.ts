import { IQuery, IQueryResult } from '@nestjs/cqrs';
import { Dragon } from '../../../domain/dragon.entity';

export class GetDragonAttackQuery implements IQuery {
  constructor(
    public readonly payload: {
      dragonId: Dragon['id'];
    },
  ) {}
}

export class GetDragonAttackQueryResult implements IQueryResult {
  constructor(public readonly attackValue: number) {}
}
