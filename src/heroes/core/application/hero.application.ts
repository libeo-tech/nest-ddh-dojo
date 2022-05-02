import { CommandHandlerType, QueryHandlerType } from '@nestjs/cqrs';
import { CreateHeroCommandHandler } from './commands/create-hero/create-hero.command-handler';
import { GainXpCommandHandler } from './commands/gain-xp/gain-xp.command-handler';
import { HealHeroCommandHandler } from './commands/heal-hero/heal-hero.command-handler';
import { HurtHeroCommandHandler } from './commands/hurt-hero/hurt-hero.command-handler';
import { LevelUpCommandHandler } from './commands/level-up/level-up.command-handler';
import { GetAllHeroesQueryHandler } from './queries/get-all-heores/get-all-heroes.query-handler';
import { GetHeroAttackQueryHandler } from './queries/get-hero-attack/get-hero-attack.query-handler';
import { GetHeroByIdQueryHandler } from './queries/get-hero-by-id/get-hero-by-id.query-handler';
import { IsHeroDeadQueryHandler } from './queries/is-hero-dead/is-hero-dead.query-handler';
import { HeroSagas } from './sagas/hero.saga';

const HeroQueryHandler: QueryHandlerType[] = [
  GetHeroByIdQueryHandler,
  GetAllHeroesQueryHandler,
  GetHeroAttackQueryHandler,
  IsHeroDeadQueryHandler,
];
const HeroCommandHandler: CommandHandlerType[] = [
  CreateHeroCommandHandler,
  GainXpCommandHandler,
  HealHeroCommandHandler,
  HurtHeroCommandHandler,
  LevelUpCommandHandler,
];

export const HeroApplications = [
  ...HeroQueryHandler,
  ...HeroCommandHandler,
  HeroSagas,
];
