import { CommandHandlerType, QueryHandlerType } from '@nestjs/cqrs';
import { GenerateRandomItemCommandHandler } from './commands/generate-random-item/generate-random-item.command-handler';
import { GetAllItemsQueryHandler } from './queries/get-all-items/get-all-items.query-handler';
import { GetHeroItemsQueryHandler } from './queries/get-hero-items/get-hero-items.query-handler';
import { ItemSagas } from './sagas/item.saga';

const ItemQueryHandler: QueryHandlerType[] = [
  GetAllItemsQueryHandler,
  GetHeroItemsQueryHandler,
];
const ItemCommandHandler: CommandHandlerType[] = [
  GenerateRandomItemCommandHandler,
];

export const ItemApplications = [
  ...ItemQueryHandler,
  ...ItemCommandHandler,
  ItemSagas,
];
