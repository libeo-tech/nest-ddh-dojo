import { Logger } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Hero as HeroSchema } from '../../../graphql';
import { Hero } from '../../infrastructure/heroes/hero.orm-entity';
import { mapHeroEntityToHeroSchema } from './hero.gql-mapper';
import {
  GetHeroByIdQuery,
  GetHeroByIdQueryResult,
} from '../../core/application/queries/get-hero-by-id/get-hero-by-id.query';
import { CreateHeroCommand } from '../../core/application/commands/create-hero/create-hero.command';
import { ItemPresenter } from '../../../items/interface/presenter/item.presenter';

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
    const { hero } = await this.queryBus.execute<
      GetHeroByIdQuery,
      GetHeroByIdQueryResult
    >(new GetHeroByIdQuery({ heroId }));
    const inventory = await this.itemPresenter.getHeroInventory(heroId);
    return mapHeroEntityToHeroSchema(hero, inventory);
  }

  @Mutation()
  public async createHero(
    @Args('name') heroName: Hero['name'],
  ): Promise<boolean> {
    await this.commandBus.execute(new CreateHeroCommand({ name: heroName }));
    return true;
  }
}
