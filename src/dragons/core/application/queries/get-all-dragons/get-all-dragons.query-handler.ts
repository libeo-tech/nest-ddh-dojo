import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
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

  public async execute(): Promise<GetAllDragonsQueryResult> {
    this.logger.log(`> GetAllDragonsQuery`);

    const dragons = await this.dragonPorts.getAllDragons();
    return new GetAllDragonsQueryResult(dragons);
  }
}
