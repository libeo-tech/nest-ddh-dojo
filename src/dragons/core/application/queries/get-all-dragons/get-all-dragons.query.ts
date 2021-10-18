import { IQuery, IQueryResult } from '@nestjs/cqrs';
import { Dragon } from '../../../domain/dragon.entity';

export class GetAllDragonsQuery implements IQuery {}

export class GetAllDragonsQueryResult implements IQueryResult {
  constructor(public readonly dragons: Dragon[]) {}
}
