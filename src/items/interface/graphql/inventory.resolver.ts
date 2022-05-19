import { InternalServerErrorException, Logger } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Item as ItemSchema } from '../../../graphql';
import { Hero } from '../../../heroes/core/domain/hero.entity';
import {
  GetHeroItemsQueryResult,
  GetHeroItemsQuery,
} from '../../core/application/queries/get-hero-items/get-hero-items.query';
import { mapItemEntityToItemSchema } from './item.gql-mapper';

@Resolver('Hero')
export class InventoryResolver {
  private readonly logger = new Logger(InventoryResolver.name);

  constructor(private readonly queryBus: QueryBus) {}

  @ResolveField()
  public async inventory(@Parent() hero: Hero): Promise<ItemSchema[]> {
    const result = await this.queryBus.execute<
      GetHeroItemsQuery,
      GetHeroItemsQueryResult
    >(new GetHeroItemsQuery({ ownerId: hero.id }));

    if (result.isErr()) {
      throw new InternalServerErrorException();
    }

    const { items } = result.value;
    return items.map((item) => mapItemEntityToItemSchema(item));
  }
}
