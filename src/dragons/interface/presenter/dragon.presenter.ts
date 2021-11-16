import { Injectable, Logger } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { withSpans } from '../../../common/utils/trace/honeycomb';
import {
  GetDragonByIdQuery,
  GetDragonByIdQueryResult,
} from '../../core/application/queries/get-dragon-by-id/get-dragon-by-id.query';
import { Dragon } from '../../core/domain/dragon.entity';

@Injectable()
@withSpans()
export class DragonPresenter {
  private readonly logger = new Logger(DragonPresenter.name);

  constructor(private readonly queryBus: QueryBus) {}

  public async getById(dragonId: Dragon['id']): Promise<Dragon> {
    const { dragon } = await this.queryBus.execute<
      GetDragonByIdQuery,
      GetDragonByIdQueryResult
    >(new GetDragonByIdQuery({ dragonId }));
    return dragon;
  }
}
