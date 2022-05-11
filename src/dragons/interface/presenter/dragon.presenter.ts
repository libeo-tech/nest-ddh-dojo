import { Injectable, Logger } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  GetDragonByIdQuery,
  GetDragonByIdQueryResult,
} from '../../core/application/queries/get-dragon-by-id/get-dragon-by-id.query';
import { Dragon } from '../../core/domain/dragon.entity';

@Injectable()
export class DragonPresenter {
  private readonly logger = new Logger(DragonPresenter.name);

  constructor(private readonly queryBus: QueryBus) {}

  public async getById(
    dragonId: Dragon['id'],
  ): Promise<GetDragonByIdQueryResult> {
    const result = await this.queryBus.execute<
      GetDragonByIdQuery,
      GetDragonByIdQueryResult
    >(new GetDragonByIdQuery({ dragonId }));
    return result;
  }
}
