import {
  CombatLog as CombatLogEntity,
  Outcome,
} from '../../../core/domain/combat-log/combat-log.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseOrmEntity } from '../../../../common/infrastructure/typeorm/base.orm-entity';
import { Hero as HeroOrmEntity } from '../../../../heroes/infrastructure/typeorm/hero.orm-entity';
import { HeroFighter } from '../../../core/domain/fight/fighter.entity';

@Entity()
export class PvpLog extends BaseOrmEntity {
  id!: CombatLogEntity<HeroFighter, HeroFighter>['id'];

  @ManyToOne(() => HeroOrmEntity)
  @JoinColumn()
  attacker!: HeroOrmEntity;

  @Column({ nullable: false })
  attackerId!: HeroOrmEntity['id'];

  @ManyToOne(() => HeroOrmEntity)
  @JoinColumn()
  defender!: HeroOrmEntity;

  @Column({ nullable: false })
  defenderId!: HeroOrmEntity['id'];

  @Column({ type: 'bigint', default: 0 })
  numberOfRounds!: number;

  @Column({
    type: 'simple-enum',
    default: Outcome.DRAW,
    enum: Outcome,
  })
  outcome!: Outcome;
}
