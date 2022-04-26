import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetByIdPort } from '../../../../../common/core/domain/base.ports';
import { generateRandomNumber } from '../../../../../common/utils/random/random-number';
import { withSpan } from '../../../../../common/utils/trace/honeycomb';
import { Hero } from '../../../domain/hero.entity';
import { HeroNotFoundError } from '../../../domain/hero.error';
import {
  GetHeroAttackQuery,
  GetHeroAttackQueryResult,
} from './get-hero-attack.query';

@QueryHandler(GetHeroAttackQuery)
export class GetHeroAttackQueryHandler
  implements IQueryHandler<GetHeroAttackQuery>
{
  constructor(@Inject(Hero) private readonly heroPorts: GetByIdPort<Hero>) {}

  private readonly logger = new Logger(GetHeroAttackQueryHandler.name);

  @withSpan()
  public async execute({
    payload,
  }: GetHeroAttackQuery): Promise<GetHeroAttackQueryResult> {
    this.logger.log(`> GetHeroAttackQuery: ${JSON.stringify(payload)}`);
    const { heroId } = payload;

    const hero = await this.heroPorts.getById(heroId);
    if (!hero) {
      throw new HeroNotFoundError(heroId);
    }
    const attackValue = generateRandomNumber(hero.level, hero.level * 2);
    return new GetHeroAttackQueryResult(attackValue);
  }
}
