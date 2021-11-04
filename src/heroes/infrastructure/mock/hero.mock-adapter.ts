import { MockAdapter } from '../../../common/infrastructure/base.mock-adapter';
import { Hero } from '../../core/domain/hero.entity';
import { heroFixtureFactory } from '../../core/domain/hero.fixture-factory';
import { HeroPorts } from '../../core/application/ports/hero.ports';

export class HeroMockAdapter extends MockAdapter<Hero> implements HeroPorts {
  entityName = 'Hero';
  entityFactory = heroFixtureFactory;
}
