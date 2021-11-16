import {
  DragonFighter,
  FighterType,
  HeroFighter,
} from '../fight/fighter.entity';
import { CombatLog, Outcome } from './combat-log.entity';

export const combatLogEntityFactory = (
  combatLogProperties: Pick<
    CombatLog<HeroFighter, DragonFighter>,
    'attackerId' | 'defenderId'
  >,
): CombatLog<HeroFighter, DragonFighter> => {
  const { attackerId: heroId, defenderId: dragonId } = combatLogProperties;
  const combatLog: CombatLog<HeroFighter, DragonFighter> = Object.assign(
    new CombatLog(),
    {
      attacker: { id: heroId, type: FighterType.HERO },
      defenderId: { id: dragonId, type: FighterType.DRAGON },
      numberOfRounds: 0,
      outcome: Outcome.DRAW,
      ...combatLogProperties,
    },
  );

  return combatLog;
};
