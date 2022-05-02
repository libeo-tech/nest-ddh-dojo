import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllPort } from '../../../../../common/core/domain/base.ports';
import { withSpan } from '../../../../../common/utils/trace/honeycomb';
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

  private readonly logger = new Logger(GetAllHeroesQueryHandler.name);

  @withSpan()
  public async execute(): Promise<GetAllHeroesQueryResult> {
    this.logger.log(`> GetAllHeroesQuery`);

    const heroes = await this.heroPorts.getAll();
    return new GetAllHeroesQueryResult(heroes);
  }
}
