import { QueryHandlerType, CommandHandlerType } from '@nestjs/cqrs';
import { PublishEventCommandHandler } from '../../../common/core/commands/publish-event.command-handler';
import { AttackCommandHandler } from './commands/attack/attack.command-handler';
import { RewardHeroCommandHandler } from './commands/reward-hero/reward-hero.command-handler';
import { CombatSagas } from './sagas/combat.saga';

const CombatQueryHandler: QueryHandlerType[] = [];
const CombatCommandHandler: CommandHandlerType[] = [
  AttackCommandHandler,
  RewardHeroCommandHandler,
  PublishEventCommandHandler,
];

export const CombatApplications = [
  ...CombatQueryHandler,
  ...CombatCommandHandler,
  CombatSagas,
];
