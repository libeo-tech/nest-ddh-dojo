import { Injectable, Logger } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Damage } from '../../../combat/core/domain/attack/damage.object-value';
import { HeroFighter } from '../../../combat/core/domain/fight/fighter.entity';
import { withSpans } from '../../../common/utils/trace/honeycomb';
import { HurtDragonCommand } from '../../core/application/commands/hurt-dragon/hurt-dragon.command';
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
