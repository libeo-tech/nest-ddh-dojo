import { CommandHandlerType, QueryHandlerType } from '@nestjs/cqrs';
import { AttackCommandHandler } from './commands/attack/attack.command-handler';
import { CreateHeroCommandHandler } from './commands/create-hero/create-hero.command-handler';
import { GainXpCommandHandler } from './commands/gain-xp/gain-xp.command-handler';
import { LevelUpCommandHandler } from './commands/level-up/level-up.command-handler';
import { GetHeroByIdQueryHandler } from './queries/get-hero-by-id/get-hero-by-id.query-handler';
import { HeroSagas } from './sagas/hero.saga';

const HeroQueryHandler: QueryHandlerType[] = [GetHeroByIdQueryHandler];
const HeroCommandHandler: CommandHandlerType[] = [
  AttackCommandHandler,
  CreateHeroCommandHandler,
  GainXpCommandHandler,
  LevelUpCommandHandler,
];

export const HeroApplications = [
  ...HeroQueryHandler,
  ...HeroCommandHandler,
  HeroSagas,
];
