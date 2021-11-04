import { Base } from '../../../common/core/domain/base.entity';
import { Hero } from '../../../heroes/core/domain/hero.entity';

export class Item extends Base {
  id: string & { __brand: 'itemId' };
  name: string;
}

export class ItemWithOwner extends Item {
  owner: Hero;
}
