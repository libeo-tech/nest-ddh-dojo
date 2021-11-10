import {
  HttpException,
  HttpStatus,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Hero as HeroSchema } from '../../../graphql';
import { Hero } from '../../infrastructure/typeorm/hero.orm-entity';
import { mapHeroEntityToHeroSchema } from './hero.gql-mapper';
import {
  GetHeroByIdQuery,
  GetHeroByIdQueryResult,
} from '../../core/application/queries/get-hero-by-id/get-hero-by-id.query';
import { CreateHeroCommand } from '../../core/application/commands/create-hero/create-hero.command';
import { ItemPresenter } from '../../../items/interface/presenter/item.presenter';
import { withSpan } from '../../../common/utils/trace/honeycomb';
import { HeroNotFoundError } from '../../core/domain/hero.error';
import { Dragon } from '../../../dragons/core/domain/dragon.entity';
import { AttackCommand } from '../../core/application/commands/attack/attack.command';

@Resolver('hero')
export class HeroResolver {
  private readonly logger = new Logger(HeroResolver.name);

  constructor(
    private readonly itemPresenter: ItemPresenter,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Query()
  @withSpan()
  public async getHero(@Args('id') heroId: Hero['id']): Promise<HeroSchema> {
    try {
      const [{ hero }, inventory] = await Promise.all([
        this.queryBus.execute<GetHeroByIdQuery, GetHeroByIdQueryResult>(
          new GetHeroByIdQuery({ heroId }),
        ),
        this.itemPresenter.getHeroInventory(heroId),
      ]);
      return mapHeroEntityToHeroSchema(hero, inventory);
    } catch (error) {
      this.logger.error(error);
      if (error instanceof HeroNotFoundError) {
        throw new NotFoundException(error.message);
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Mutation()
  @withSpan()
  public async createHero(@Args('name') name: Hero['name']): Promise<boolean> {
    await this.commandBus.execute(new CreateHeroCommand({ name }));
    return true;
  }

  @Mutation()
  @withSpan()
  public async attackDragon(
    @Args('heroId') heroId: Hero['id'],
    @Args('dragonId') dragonId: Dragon['id'],
  ): Promise<boolean> {
    try {
      await this.commandBus.execute(
        new AttackCommand({ targetId: dragonId, heroId }),
      );
      return true;
    } catch (error) {
      console.error(error);
      this.logger.error(error);
      if (error instanceof HeroNotFoundError) {
        throw new NotFoundException(error.message);
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
