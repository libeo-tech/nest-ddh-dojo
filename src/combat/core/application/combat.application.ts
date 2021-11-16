import { QueryHandlerType, CommandHandlerType } from '@nestjs/cqrs';
import { AttackCommandHandler } from './commands/attack/attack.command-handler';
import { RewardHeroCommandHandler } from './commands/reward-hero/reward-hero.command-handler';
import { CombatSagas } from './sagas/combat.saga';

const CombatQueryHandler: QueryHandlerType[] = [];
const CombatCommandHandler: CommandHandlerType[] = [
  AttackCommandHandler,
  RewardHeroCommandHandler,
];

export const CombatApplications = [
  ...CombatQueryHandler,
  ...CombatCommandHandler,
  CombatSagas,
];
