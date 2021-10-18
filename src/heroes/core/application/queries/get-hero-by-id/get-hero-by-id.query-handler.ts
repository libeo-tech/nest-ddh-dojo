import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { HeroPorts } from '../../ports/hero.ports';
import {
  GetHeroByIdQuery,
  GetHeroByIdQueryResult,
} from './get-hero-by-id.query';

@QueryHandler(GetHeroByIdQuery)
export class GetHeroByIdQueryHandler
  implements IQueryHandler<GetHeroByIdQuery>
{
  constructor(private readonly heroPort: HeroPorts) {}

  private readonly logger = new Logger(GetHeroByIdQueryHandler.name);

  public async execute({
    payload,
  }: GetHeroByIdQuery): Promise<GetHeroByIdQueryResult> {
    this.logger.log(`> GetHeroByIdQuery: ${JSON.stringify(payload)}`);
    const { heroId } = payload;

    const hero = await this.heroPort.getHeroById(heroId);
    return new GetHeroByIdQueryResult(hero);
  }
}
