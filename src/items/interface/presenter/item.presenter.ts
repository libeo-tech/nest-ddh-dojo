import { Injectable, Logger } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Hero } from '../../../heroes/core/domain/hero.entity';
import {
  GenerateRandomItemCommand,
  GenerateRandomItemCommandResult,
} from '../../core/application/commands/generate-random-item/generate-random-item.command';
import {
  GetHeroItemsQuery,
  GetHeroItemsQueryResult,
} from '../../core/application/queries/get-hero-items/get-hero-items.query';

@Injectable()
export class ItemPresenter {
  private readonly logger = new Logger(ItemPresenter.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  public async getHeroInventory(
    heroId: Hero['id'],
  ): Promise<GetHeroItemsQueryResult> {
    const result = await this.queryBus.execute<
      GetHeroItemsQuery,
      GetHeroItemsQueryResult
    >(new GetHeroItemsQuery({ ownerId: heroId }));
    return result;
  }

  public async giveNewRandomItemToHero(
    heroId: Hero['id'],
  ): Promise<GenerateRandomItemCommandResult> {
    const result = await this.commandBus.execute<
      GenerateRandomItemCommand,
      GenerateRandomItemCommandResult
    >(new GenerateRandomItemCommand({ ownerId: heroId }));
    return result;
  }
}
