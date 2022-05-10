import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  IsDragonDeadQuery,
  IsDragonDeadQueryResult,
} from './is-dragon-dead.query';
import { Inject } from '@nestjs/common';
import { GetByIdPort } from '../../../../../common/core/domain/base.ports';
import { Dragon } from '../../../domain/dragon.entity';
import { DragonNotFoundError } from '../../../domain/dragon.error';
import { err, ok } from 'neverthrow';
import { LogPayloadAndResult } from '../../../../../common/utils/handler-decorators/log-payload-and-result.decorator';
import { WrapInTryCatchWithUnknownApplicationError } from '../../../../../common/utils/handler-decorators/wrap-in-try-catch-with-unknown-application-error.decorator';

@QueryHandler(IsDragonDeadQuery)
export class IsDragonDeadQueryHandler
  implements IQueryHandler<IsDragonDeadQuery>
{
  constructor(
    @Inject(Dragon) private readonly dragonPorts: GetByIdPort<Dragon>,
  ) {}

  @WrapInTryCatchWithUnknownApplicationError('DragonModule')
  @LogPayloadAndResult('DragonModule')
  public async execute({
    payload,
  }: IsDragonDeadQuery): Promise<IsDragonDeadQueryResult> {
    const { dragonId } = payload;

    const dragon = await this.dragonPorts.getById(dragonId);
    if (!dragon) {
      return err(new DragonNotFoundError(dragonId));
    }
    const isDead = dragon.currentHp <= 0;
    return ok({ isDead });
  }
}
