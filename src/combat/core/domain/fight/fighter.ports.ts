import { Damage } from '../attack/damage.object-value';
import { Fight } from './fight.type';
import { Fighter } from './fighter.entity';

export abstract class FighterIPA<X extends Fighter, Y extends Fighter> {
  abstract getPorts(fight: Fight<X, Y>): FighterPorts<X, Y>;
}

export abstract class FighterPorts<X extends Fighter, Y extends Fighter> {
  abstract getAttackStrength(id: X['id']): Promise<number>;
  abstract receiveDamage(id: Y['id'], damage: Damage<X>): Promise<void>;
  abstract isDead(id: Y['id']): Promise<boolean>;
}
