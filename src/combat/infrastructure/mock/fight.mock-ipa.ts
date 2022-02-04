import { FighterIPA } from '../../core/application/ports/fighter.ports';
import { Fighter } from '../../core/domain/fight/fighter.entity';
import { fightMockAdapter } from './fight.mock-adapter';

export const fightMockIPA: FighterIPA<Fighter, Fighter> = {
  getPorts: () => fightMockAdapter,
};