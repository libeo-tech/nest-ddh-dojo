import { Item as ItemEntity } from '../../core/domain/item.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Base } from '../../../common/core/domain/base.entity';
import { Hero } from '../../../heroes/infrastructure/heroes/hero.orm-entity';

@Entity()
export class Item extends Base {
  id!: ItemEntity['id'];

  @Column({ type: 'varchar' })
  name!: string;

  @ManyToOne(() => Hero, (hero: Hero) => hero.items)
  @JoinColumn()
  owner!: Hero | null;

  @Column({ nullable: true })
  ownerId!: Hero['id'] | null;
}
