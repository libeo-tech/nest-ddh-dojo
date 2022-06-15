import { MockAdapter } from '../../../common/infrastructure/mock/base.mock-adapter';
import { Dragon } from '../../core/domain/dragon.entity';
import { dragonEntityFactory } from '../../core/domain/dragon.entity-factory';

export class DragonMockAdapter extends MockAdapter<Dragon> {
  entityName = 'Dragon';
  entityFactory = dragonEntityFactory;
}
