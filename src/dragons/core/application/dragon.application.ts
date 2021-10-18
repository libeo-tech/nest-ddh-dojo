import { CommandHandlerType, QueryHandlerType } from '@nestjs/cqrs';
import { GenerateRandomDragonCommandHandler } from './commands/generate-random-dragon/generate-random-dragon.command-handler';
import { SlayDragonCommandHandler } from './commands/slay-dragon/slay-dragon.command-handler';
import { GetAllDragonsQueryHandler } from './queries/get-all-dragons/get-all-dragons.query-handler';

const DragonQueryHandler: QueryHandlerType[] = [GetAllDragonsQueryHandler];
const DragonCommandHandler: CommandHandlerType[] = [
  GenerateRandomDragonCommandHandler,
  SlayDragonCommandHandler,
];

export const DragonApplications = [
  ...DragonQueryHandler,
  ...DragonCommandHandler,
];
