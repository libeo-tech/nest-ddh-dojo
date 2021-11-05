import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetByIdPort } from '../../../../../common/core/ports/base.ports';
import { withSpan } from '../../../../../common/utils/trace/honeycomb';
import { Hero } from '../../../domain/hero.entity';
import { HeroNotFoundError } from '../../../domain/hero.error';
import {
  GetHeroByIdQuery,
  GetHeroByIdQueryResult,
} from './get-hero-by-id.query';

@QueryHandler(GetHeroByIdQuery)
export class GetHeroByIdQueryHandler
  implements IQueryHandler<GetHeroByIdQuery>
{
  constructor(
    @Inject(Hero.name) private readonly heroPorts: GetByIdPort<Hero>,
  ) {}

  private readonly logger = new Logger(GetHeroByIdQueryHandler.name);

  @withSpan()
  public async execute({
    payload,
  }: GetHeroByIdQuery): Promise<GetHeroByIdQueryResult> {
    this.logger.log(`> GetHeroByIdQuery: ${JSON.stringify(payload)}`);
    const { heroId } = payload;

    const hero = await this.heroPorts.getById(heroId);
    if (!hero) {
      throw new HeroNotFoundError(heroId);
    }
    return new GetHeroByIdQueryResult(hero);
  }
}
