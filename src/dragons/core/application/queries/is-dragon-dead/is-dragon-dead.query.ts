import { IQuery, IQueryResult } from '@nestjs/cqrs';
import { Dragon } from '../../../domain/dragon.entity';

export class IsDragonDeadQuery implements IQuery {
  constructor(
    public readonly payload: {
      dragonId: Dragon['id'];
    },
  ) {}
}

export class IsDragonDeadQueryResult implements IQueryResult {
  constructor(public readonly isDead: boolean) {}
}
