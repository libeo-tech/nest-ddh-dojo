import { FighterIPA } from '../../core/domain/fight/fighter.ports';
import { Fighter } from '../../core/domain/fight/fighter.entity';
import { attackerMockAdapter, defenderMockAdapter } from './fight.mock-adapter';

export const fightMockIPA: FighterIPA<Fighter, Fighter> = {
  getPorts: () => {
    return {
      attackerPorts: attackerMockAdapter,
      defenderPorts: defenderMockAdapter,
    };
  },
};
