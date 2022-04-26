import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllPort } from '../../../../../common/core/domain/base.ports';
import { withSpan } from '../../../../../common/utils/trace/honeycomb';
import { Dragon } from '../../../domain/dragon.entity';
import {
  GetAllDragonsQuery,
  GetAllDragonsQueryResult,
} from './get-all-dragons.query';

@QueryHandler(GetAllDragonsQuery)
export class GetAllDragonsQueryHandler
  implements IQueryHandler<GetAllDragonsQuery>
{
  constructor(
    @Inject(Dragon)
    private readonly dragonPorts: GetAllPort<Dragon>,
  ) {}

  private readonly logger = new Logger(GetAllDragonsQueryHandler.name);

  @withSpan()
  public async execute(): Promise<GetAllDragonsQueryResult> {
    this.logger.log(`> GetAllDragonsQuery`);

    const dragons = await this.dragonPorts.getAll();
    return new GetAllDragonsQueryResult(dragons);
  }
}
