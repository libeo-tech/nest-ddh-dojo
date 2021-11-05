import { MockAdapter } from '../../../common/infrastructure/base.mock-adapter';
import { Hero } from '../../core/domain/hero.entity';
import { heroFixtureFactory } from '../../core/domain/hero.fixture-factory';

export class HeroMockAdapter extends MockAdapter<Hero> {
  entityName = 'Hero';
  entityFactory = heroFixtureFactory;
}
