import { MockAdapter } from '../../../common/infrastructure/mock/base.mock-adapter';
import { Hero } from '../../core/domain/hero.entity';
import { heroEntityFactory } from '../../core/domain/hero.entity-factory';

export class HeroMockAdapter extends MockAdapter<Hero> {
  entityName = 'Hero';
  entityFactory = heroEntityFactory;
}
