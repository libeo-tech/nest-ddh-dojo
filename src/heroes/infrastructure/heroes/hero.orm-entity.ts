import { Hero as HeroEntity } from '../../core/domain/hero.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Base } from '../../../common/core/domain/base.entity';
import { Item } from '../../../items/infrastructure/items/item.orm-entity';

@Entity()
export class Hero extends Base {
  id!: HeroEntity['id'];

  @Column({ type: 'varchar' })
  name!: string;

  @Column({ type: 'bigint', default: 0 })
  xp!: number;

  @Column({ type: 'bigint', default: 1 })
  level!: number;

  @OneToMany(() => Item, (item: Item) => item.owner)
  items!: Item[] | null;
}
