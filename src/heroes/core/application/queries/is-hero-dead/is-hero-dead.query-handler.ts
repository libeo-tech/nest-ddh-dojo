import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { IsHeroDeadQuery, IsHeroDeadQueryResult } from './is-hero-dead.query';
import { withSpan } from '../../../../../common/utils/trace/honeycomb';
import { Inject, Logger } from '@nestjs/common';
import { GetByIdPort } from '../../../../../common/core/ports/base.ports';
import { Hero } from '../../../domain/hero.entity';
import { HeroNotFoundError } from '../../../domain/hero.error';

@QueryHandler(IsHeroDeadQuery)
export class IsHeroDeadQueryHandler implements IQueryHandler<IsHeroDeadQuery> {
  constructor(@Inject(Hero) private readonly heroPorts: GetByIdPort<Hero>) {}

  private readonly logger = new Logger(IsHeroDeadQueryHandler.name);

  @withSpan()
  public async execute({
    payload,
  }: IsHeroDeadQuery): Promise<IsHeroDeadQueryResult> {
    this.logger.log(`> IsHeroDeadQuery: ${JSON.stringify(payload)}`);
    const { heroId } = payload;

    const hero = await this.heroPorts.getById(heroId);
    if (!hero) {
      throw new HeroNotFoundError(heroId);
    }
    const isDead = hero.currentHp <= 0;
    return new IsHeroDeadQueryResult(isDead);
  }
}
