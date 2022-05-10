import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ok } from 'neverthrow';
import { GetAllPort } from '../../../../../common/core/domain/base.ports';
import { LogPayloadAndResult } from '../../../../../common/utils/handler-decorators/log-payload-and-result.decorator';
import { WrapInTryCatchWithUnknownApplicationError } from '../../../../../common/utils/handler-decorators/wrap-in-try-catch-with-unknown-application-error.decorator';
import { Hero } from '../../../domain/hero.entity';
import {
  GetAllHeroesQuery,
  GetAllHeroesQueryResult,
} from './get-all-heroes.query';

@QueryHandler(GetAllHeroesQuery)
export class GetAllHeroesQueryHandler
  implements IQueryHandler<GetAllHeroesQuery>
{
  constructor(
    @Inject(Hero)
    private readonly heroPorts: GetAllPort<Hero>,
  ) {}

  @WrapInTryCatchWithUnknownApplicationError('HeroModule')
  @LogPayloadAndResult('HeroModule')
  public async execute(): Promise<GetAllHeroesQueryResult> {
    const heroes = await this.heroPorts.getAll();
    return ok({ heroes });
  }
}
