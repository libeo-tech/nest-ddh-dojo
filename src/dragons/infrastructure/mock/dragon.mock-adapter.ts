import { MockAdapter } from '../../../common/infrastructure/base.mock-adapter';
import { Dragon } from '../../core/domain/dragon.entity';
import { dragonEntityFactory } from '../../core/domain/dragon.entity-factory';
import { DragonPorts } from '../../core/application/ports/dragon.ports';

export class DragonMockAdapter
  extends MockAdapter<Dragon>
  implements DragonPorts
{
  entityName = 'Dragon';
  entityFactory = dragonEntityFactory;
}
