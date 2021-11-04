import { Dragon as DragonEntity } from '../../core/domain/dragon.entity';
import { Column, Entity } from 'typeorm';
import { BaseOrmEntity } from '../../../common/infrastructure/base.orm-entity';
import { DragonColor } from '../../core/domain/dragon.entity';

@Entity()
export class Dragon extends BaseOrmEntity {
  id!: DragonEntity['id'];

  @Column({ type: 'bigint', default: 1 })
  level!: number;

  @Column({
    type: 'simple-enum',
    default: DragonColor.RED,
    enum: DragonColor,
  })
  color!: DragonColor;
}
