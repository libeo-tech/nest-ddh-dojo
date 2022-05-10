import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { IsHeroDeadQuery, IsHeroDeadQueryResult } from './is-hero-dead.query';
import { Inject } from '@nestjs/common';
import { GetByIdPort } from '../../../../../common/core/domain/base.ports';
import { Hero } from '../../../domain/hero.entity';
import { HeroNotFoundError } from '../../../domain/hero.error';
import { err, ok } from 'neverthrow';
import { LogPayloadAndResult } from '../../../../../common/utils/handler-decorators/log-payload-and-result.decorator';
import { WrapInTryCatchWithUnknownApplicationError } from '../../../../../common/utils/handler-decorators/wrap-in-try-catch-with-unknown-application-error.decorator';

@QueryHandler(IsHeroDeadQuery)
export class IsHeroDeadQueryHandler implements IQueryHandler<IsHeroDeadQuery> {
  constructor(@Inject(Hero) private readonly heroPorts: GetByIdPort<Hero>) {}

  @WrapInTryCatchWithUnknownApplicationError('HeroModule')
  @LogPayloadAndResult('HeroModule')
  public async execute({
    payload,
  }: IsHeroDeadQuery): Promise<IsHeroDeadQueryResult> {
    const { heroId } = payload;

    const hero = await this.heroPorts.getById(heroId);
    if (!hero) {
      return err(new HeroNotFoundError(heroId));
    }
    const isDead = hero.currentHp <= 0;
    return ok({ isDead });
  }
}
