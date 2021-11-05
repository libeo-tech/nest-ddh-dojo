import { MockAdapter } from '../../../common/infrastructure/base.mock-adapter';
import { Dragon } from '../../core/domain/dragon.entity';
import { dragonEntityFactory } from '../../core/domain/dragon.entity-factory';
import { BasePorts } from '../../../common/core/ports/base.ports';

export class DragonMockAdapter
  extends MockAdapter<Dragon>
  implements BasePorts<Dragon>
{
  entityName = 'Dragon';
  entityFactory = dragonEntityFactory;
}
