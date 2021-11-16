import { MockAdapter } from '../../../common/infrastructure/base.mock-adapter';
import { CombatLog } from '../../core/domain/combat-log/combat-log.entity';
import { combatLogEntityFactory } from '../../core/domain/combat-log/combat-log.entity-factory';
import {
  HeroFighter,
  DragonFighter,
} from '../../core/domain/fight/fighter.entity';

export class CombatLogMockAdapter extends MockAdapter<
  CombatLog<HeroFighter, DragonFighter>
> {
  entityFactory = combatLogEntityFactory;
  entityName = 'CombatLog';
}
