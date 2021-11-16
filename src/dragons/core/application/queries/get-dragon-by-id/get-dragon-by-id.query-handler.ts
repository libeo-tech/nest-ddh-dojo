import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetByIdPort } from '../../../../../common/core/ports/base.ports';
import { withSpan } from '../../../../../common/utils/trace/honeycomb';
import { Dragon } from '../../../domain/dragon.entity';
import { DragonNotFoundError } from '../../../domain/dragon.error';
import {
  GetDragonByIdQuery,
  GetDragonByIdQueryResult,
} from './get-dragon-by-id.query';

@QueryHandler(GetDragonByIdQuery)
export class GetDragonByIdQueryHandler
  implements IQueryHandler<GetDragonByIdQuery>
{
  constructor(
    @Inject(Dragon) private readonly dragonPorts: GetByIdPort<Dragon>,
  ) {}

  private readonly logger = new Logger(GetDragonByIdQueryHandler.name);

  @withSpan()
  public async execute({
    payload,
  }: GetDragonByIdQuery): Promise<GetDragonByIdQueryResult> {
    this.logger.log(`> GetDragonByIdQuery: ${JSON.stringify(payload)}`);
    const { dragonId } = payload;

    const dragon = await this.dragonPorts.getById(dragonId);
    if (!dragon) {
      throw new DragonNotFoundError(dragonId);
    }
    return new GetDragonByIdQueryResult(dragon);
  }
}
