import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  IsDragonDeadQuery,
  IsDragonDeadQueryResult,
} from './is-dragon-dead.query';
import { withSpan } from '../../../../../common/utils/trace/honeycomb';
import { Inject, Logger } from '@nestjs/common';
import { GetByIdPort } from '../../../../../common/core/domain/base.ports';
import { Dragon } from '../../../domain/dragon.entity';
import { DragonNotFoundError } from '../../../domain/dragon.error';

@QueryHandler(IsDragonDeadQuery)
export class IsDragonDeadQueryHandler
  implements IQueryHandler<IsDragonDeadQuery>
{
  constructor(
    @Inject(Dragon) private readonly dragonPorts: GetByIdPort<Dragon>,
  ) {}

  private readonly logger = new Logger(IsDragonDeadQueryHandler.name);

  @withSpan()
  public async execute({
    payload,
  }: IsDragonDeadQuery): Promise<IsDragonDeadQueryResult> {
    this.logger.log(`> IsDragonDeadQuery: ${JSON.stringify(payload)}`);
    const { dragonId } = payload;

    const dragon = await this.dragonPorts.getById(dragonId);
    if (!dragon) {
      throw new DragonNotFoundError(dragonId);
    }
    const isDead = dragon.currentHp <= 0;
    return new IsDragonDeadQueryResult(isDead);
  }
}
