import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetByIdPort } from '../../../../../common/core/domain/base.ports';
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

  private readonly logger = new Logger(GetDragonAttackQueryHandler.name);

  public async execute({
    payload,
  }: GetDragonAttackQuery): Promise<GetDragonAttackQueryResult> {
    this.logger.log(`> GetDragonAttackQuery: ${JSON.stringify(payload)}`);
    const { dragonId } = payload;

    const dragon = await this.dragonPorts.getById(dragonId);
    if (!dragon) {
      throw new DragonNotFoundError(dragonId);
    }
    const attackValue = generateRandomNumber(
      dragon.level - 1,
      dragon.level + 1,
    );
    return new GetDragonAttackQueryResult(attackValue);
  }
}
