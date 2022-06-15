import { Base } from '../../../../common/core/domain/base.entity';
import { DragonFighter, Fighter, HeroFighter } from '../fight/fighter.entity';

export enum Outcome {
  WIN = 'WIN',
  LOSS = 'LOSS',
  DRAW = 'DRAW',
  ERROR = 'ERROR',
}

export class CombatLog<X extends Fighter, Y extends Fighter> extends Base {
  id: string & { __brand: 'combatLogId' };
  attackerId: X['id'];
  defenderId: Y['id'];
  numberOfRounds: number;
  outcome: Outcome;
}

export type PveLog = CombatLog<HeroFighter, DragonFighter>;
export type PvpLog = CombatLog<HeroFighter, HeroFighter>;
