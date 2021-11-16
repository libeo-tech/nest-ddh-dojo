import {
  CombatLog as CombatLogEntity,
  Outcome,
} from '../../../core/domain/combat-log/combat-log.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseOrmEntity } from '../../../../common/infrastructure/base.orm-entity';
import { Hero as HeroOrmEntity } from '../../../../heroes/infrastructure/typeorm/hero.orm-entity';
import { Dragon as DragonOrmEntity } from '../../../../dragons/infrastructure/typeorm/dragon.orm-entity';
import {
  DragonFighter,
  HeroFighter,
} from '../../../core/domain/fight/fighter.entity';

@Entity()
export class PveLog extends BaseOrmEntity {
  id!: CombatLogEntity<HeroFighter, DragonFighter>['id'];

  @ManyToOne(() => HeroOrmEntity)
  @JoinColumn()
  hero!: HeroOrmEntity;

  @Column({ nullable: false })
  heroId!: HeroOrmEntity['id'];

  @ManyToOne(() => DragonOrmEntity)
  @JoinColumn()
  dragon!: DragonOrmEntity;

  @Column({ nullable: false })
  dragonId!: DragonOrmEntity['id'];

  @Column({ type: 'bigint', default: 0 })
  numberOfRounds!: number;

  @Column({
    type: 'simple-enum',
    default: Outcome.DRAW,
    enum: Outcome,
  })
  outcome!: Outcome;
}
