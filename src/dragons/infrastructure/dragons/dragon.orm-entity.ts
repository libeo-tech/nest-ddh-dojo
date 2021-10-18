import { Dragon as DragonEntity } from '../../core/domain/dragon.entity';
import { Column, Entity } from 'typeorm';
import { Base } from '../../../common/core/domain/base.entity';
import { DragonColor } from '../../core/domain/dragon.entity';

@Entity()
export class Dragon extends Base {
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
