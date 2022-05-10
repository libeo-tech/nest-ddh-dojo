import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { err, ok } from 'neverthrow';
import { GetByIdPort } from '../../../../../common/core/domain/base.ports';
import { LogPayloadAndResult } from '../../../../../common/utils/handler-decorators/log-payload-and-result.decorator';
import { WrapInTryCatchWithUnknownApplicationError } from '../../../../../common/utils/handler-decorators/wrap-in-try-catch-with-unknown-application-error.decorator';
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
  constructor(@Inject(Hero) private readonly heroPorts: GetByIdPort<Hero>) {}

  @WrapInTryCatchWithUnknownApplicationError('HeroModule')
  @LogPayloadAndResult('HeroModule')
  public async execute({
    payload,
  }: GetHeroByIdQuery): Promise<GetHeroByIdQueryResult> {
    const { heroId } = payload;

    const hero = await this.heroPorts.getById(heroId);
    if (!hero) {
      return err(new HeroNotFoundError(heroId));
    }
    return ok({ hero });
  }
}
