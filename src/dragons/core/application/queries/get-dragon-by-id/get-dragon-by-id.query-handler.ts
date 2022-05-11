import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { err, ok } from 'neverthrow';
import { GetByIdPort } from '../../../../../common/core/domain/base.ports';
import { LogPayloadAndResult } from '../../../../../common/utils/handler-decorators/log-payload-and-result.decorator';
import { WrapInTryCatchWithUnknownApplicationError } from '../../../../../common/utils/handler-decorators/wrap-in-try-catch-with-unknown-application-error.decorator';
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

  @WrapInTryCatchWithUnknownApplicationError('DragonModule')
  @LogPayloadAndResult('DragonModule')
  public async execute({
    payload,
  }: GetDragonByIdQuery): Promise<GetDragonByIdQueryResult> {
    const { dragonId } = payload;

    const dragon = await this.dragonPorts.getById(dragonId);
    if (!dragon) {
      return err(new DragonNotFoundError(dragonId));
    }
    return ok({ dragon });
  }
}
