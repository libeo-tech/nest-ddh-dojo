import { Item as ItemEntity } from '../../core/domain/item.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseOrmEntity } from '../../../common/infrastructure/typeorm/base.orm-entity';
import { Hero } from '../../../heroes/infrastructure/typeorm/hero.orm-entity';

@Entity()
export class Item extends BaseOrmEntity {
  id!: ItemEntity['id'];

  @Column({ type: 'varchar' })
  name!: string;

  @ManyToOne(() => Hero, (hero: Hero) => hero.items)
  @JoinColumn()
  owner!: Hero | null;

  @Column({ nullable: true })
  ownerId!: Hero['id'] | null;
}
