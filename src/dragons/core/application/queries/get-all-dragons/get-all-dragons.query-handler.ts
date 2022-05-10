import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ok } from 'neverthrow';
import { GetAllPort } from '../../../../../common/core/domain/base.ports';
import { LogPayloadAndResult } from '../../../../../common/utils/handler-decorators/log-payload-and-result.decorator';
import { WrapInTryCatchWithUnknownApplicationError } from '../../../../../common/utils/handler-decorators/wrap-in-try-catch-with-unknown-application-error.decorator';
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

  @WrapInTryCatchWithUnknownApplicationError('DragonModule')
  @LogPayloadAndResult('DragonModule')
  public async execute(): Promise<GetAllDragonsQueryResult> {
    const dragons = await this.dragonPorts.getAll();
    return ok({ dragons });
  }
}
