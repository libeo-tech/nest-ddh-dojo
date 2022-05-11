import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { err, ok } from 'neverthrow';
import { GetByIdPort } from '../../../../../common/core/domain/base.ports';
import { LogPayloadAndResult } from '../../../../../common/utils/handler-decorators/log-payload-and-result.decorator';
import { WrapInTryCatchWithUnknownApplicationError } from '../../../../../common/utils/handler-decorators/wrap-in-try-catch-with-unknown-application-error.decorator';
import { generateRandomNumber } from '../../../../../common/utils/random/random-number';
import { Dragon } from '../../../domain/dragon.entity';
import { DragonNotFoundError } from '../../../domain/dragon.error';
import {
  GetDragonAttackQuery,
  GetDragonAttackQueryResult,
} from './get-dragon-attack.query';

@QueryHandler(GetDragonAttackQuery)
export class GetDragonAttackQueryHandler
  implements IQueryHandler<GetDragonAttackQuery>
{
  constructor(
    @Inject(Dragon) private readonly dragonPorts: GetByIdPort<Dragon>,
  ) {}

  @WrapInTryCatchWithUnknownApplicationError('DragonModule')
  @LogPayloadAndResult('DragonModule')
  public async execute({
    payload,
  }: GetDragonAttackQuery): Promise<GetDragonAttackQueryResult> {
    const { dragonId } = payload;

    const dragon = await this.dragonPorts.getById(dragonId);
    if (!dragon) {
      return err(new DragonNotFoundError(dragonId));
    }
    const attackValue = generateRandomNumber(
      dragon.level - 1,
      dragon.level + 1,
    );
    return ok({ attackValue });
  }
}
