import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { err, ok } from 'neverthrow';
import { GetByIdPort } from '../../../../../common/core/domain/base.ports';
import { LogPayloadAndResult } from '../../../../../common/utils/handler-decorators/log-payload-and-result.decorator';
import { WrapInTryCatchWithUnknownApplicationError } from '../../../../../common/utils/handler-decorators/wrap-in-try-catch-with-unknown-application-error.decorator';
import { getHeroAttackValue, Hero } from '../../../domain/hero.entity';
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

  @WrapInTryCatchWithUnknownApplicationError('HeroModule')
  @LogPayloadAndResult('HeroModule')
  public async execute({
    payload,
  }: GetHeroAttackQuery): Promise<GetHeroAttackQueryResult> {
    const { heroId } = payload;

    const hero = await this.heroPorts.getById(heroId);
    if (!hero) {
      return err(new HeroNotFoundError(heroId));
    }
    const attackValue = getHeroAttackValue(hero);
    return ok({ attackValue });
  }
}
