import { Injectable, Logger } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { withSpans } from '../../../common/utils/trace/honeycomb';
import { Hero } from '../../../heroes/core/domain/hero.entity';
import { GenerateRandomItemCommand } from '../../core/application/commands/generate-random-item/generate-random-item.command';
import {
  GetHeroItemsQuery,
  GetHeroItemsQueryResult,
} from '../../core/application/queries/get-hero-items/get-hero-items.query';
import { Item } from '../../core/domain/item.entity';

@Injectable()
@withSpans()
export class ItemPresenter {
  private readonly logger = new Logger(ItemPresenter.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  public async getHeroInventory(heroId: Hero['id']): Promise<Item[]> {
    const { items } = await this.queryBus.execute<
      GetHeroItemsQuery,
      GetHeroItemsQueryResult
    >(new GetHeroItemsQuery({ ownerId: heroId }));
    return items;
  }

  public async giveNewRandomItemToHero(heroId: Hero['id']): Promise<void> {
    await this.commandBus.execute<GenerateRandomItemCommand>(
      new GenerateRandomItemCommand({ ownerId: heroId }),
    );
  }
}
