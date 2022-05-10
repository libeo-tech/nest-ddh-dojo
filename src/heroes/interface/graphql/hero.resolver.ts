import {
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Hero as HeroSchema } from '../../../graphql';
import { mapHeroEntityToHeroSchema } from './hero.gql-mapper';
import {
  GetHeroByIdQuery,
  GetHeroByIdQueryResult,
} from '../../core/application/queries/get-hero-by-id/get-hero-by-id.query';
import {
  CreateHeroCommand,
  CreateHeroCommandResult,
} from '../../core/application/commands/create-hero/create-hero.command';
import { ItemPresenter } from '../../../items/interface/presenter/item.presenter';
import { Hero } from '../../core/domain/hero.entity';
import {
  GetAllHeroesQuery,
  GetAllHeroesQueryResult,
} from '../../core/application/queries/get-all-heroes/get-all-heroes.query';

@Resolver('hero')
export class HeroResolver {
  private readonly logger = new Logger(HeroResolver.name);

  constructor(
    private readonly itemPresenter: ItemPresenter,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Query()
  public async getHero(@Args('id') heroId: Hero['id']): Promise<HeroSchema> {
    const [heroResult, inventoryResult] = await Promise.all([
      this.queryBus.execute<GetHeroByIdQuery, GetHeroByIdQueryResult>(
        new GetHeroByIdQuery({ heroId }),
      ),
      this.itemPresenter.getHeroInventory(heroId),
    ]);
    if (heroResult.isErr()) {
      throw new NotFoundException(heroResult.error.message);
    }
    if (inventoryResult.isErr()) {
      throw new InternalServerErrorException();
    }
    return mapHeroEntityToHeroSchema(
      heroResult.value.hero,
      inventoryResult.value.items,
    );
  }

  @Query()
  public async getAllHeroes(): Promise<HeroSchema[]> {
    const heroesResult = await this.queryBus.execute<
      GetAllHeroesQuery,
      GetAllHeroesQueryResult
    >(new GetAllHeroesQuery());
    if (heroesResult.isErr()) {
      throw new InternalServerErrorException();
    }
    return heroesResult.value.heroes.map((hero) =>
      mapHeroEntityToHeroSchema(hero),
    );
  }

  @Mutation()
  public async createHero(@Args('name') name: Hero['name']): Promise<boolean> {
    const result = await this.commandBus.execute<
      CreateHeroCommand,
      CreateHeroCommandResult
    >(new CreateHeroCommand({ name }));
    return result.isOk();
  }
}
