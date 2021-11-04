import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { withSpan } from '../../../../../common/utils/trace/honeycomb';
import { DragonPorts } from '../../ports/dragon.ports';
import {
  GetAllDragonsQuery,
  GetAllDragonsQueryResult,
} from './get-all-dragons.query';

@QueryHandler(GetAllDragonsQuery)
export class GetAllDragonsQueryHandler
  implements IQueryHandler<GetAllDragonsQuery>
{
  constructor(private readonly dragonPorts: DragonPorts) {}

  private readonly logger = new Logger(GetAllDragonsQueryHandler.name);

  @withSpan()
  public async execute(): Promise<GetAllDragonsQueryResult> {
    this.logger.log(`> GetAllDragonsQuery`);

    const dragons = await this.dragonPorts.getAll();
    return new GetAllDragonsQueryResult(dragons);
  }
}
