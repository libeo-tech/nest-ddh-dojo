import { Hero } from '../../../heroes/core/domain/hero.entity';

export class Item {
  id: string & { __brand: 'itemId' };
  name: string;
}

export class ItemWithOwner extends Item {
  owner: Hero;
}
