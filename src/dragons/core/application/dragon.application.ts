import { CommandHandlerType, QueryHandlerType } from '@nestjs/cqrs';
import { GenerateNewDragonCommandHandler } from './commands/generate-new-dragon/generate-new-dragon.command-handler';
import { HurtDragonCommandHandler } from './commands/hurt-dragon/hurt-dragon.command-handler';
import { RespawnDragonCommandHandler } from './commands/respawn-dragon/respawn-dragon.command-handler';
import { GetAllDragonsQueryHandler } from './queries/get-all-dragons/get-all-dragons.query-handler';
import { GetDragonAttackQueryHandler } from './queries/get-dragon-attack/get-dragon-attack.query-handler';
import { GetDragonByIdQueryHandler } from './queries/get-dragon-by-id/get-dragon-by-id.query-handler';
import { IsDragonDeadQueryHandler } from './queries/is-dragon-dead/is-dragon-dead.query-handler';
import { DragonSagas } from './sagas/dragon.saga';

const DragonQueryHandler: QueryHandlerType[] = [
  GetAllDragonsQueryHandler,
  GetDragonByIdQueryHandler,
  GetDragonAttackQueryHandler,
  IsDragonDeadQueryHandler,
];
const DragonCommandHandler: CommandHandlerType[] = [
  GenerateNewDragonCommandHandler,
  HurtDragonCommandHandler,
  RespawnDragonCommandHandler,
];

export const DragonApplications = [
  ...DragonQueryHandler,
  ...DragonCommandHandler,
  DragonSagas,
];
