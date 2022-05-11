import { Result } from 'neverthrow';
import { UnknownApplicationError } from '../../../../common/core/domain/base.error';
import { Damage } from '../attack/damage.object-value';
import { FighterNotFoundError } from './fight.error';
import { Fight } from './fight.type';
import { Fighter } from './fighter.entity';

export abstract class FighterIPA<X extends Fighter, Y extends Fighter> {
  abstract getPorts(fight: Fight<X, Y>): FighterPorts<X, Y>;
}

export abstract class FighterPorts<X extends Fighter, Y extends Fighter> {
  abstract getAttackStrength(
    id: X['id'],
  ): Promise<
    Result<
      { attackValue: number },
      FighterNotFoundError | UnknownApplicationError
    >
  >;
  abstract receiveDamage(
    id: Y['id'],
    damage: Damage<X>,
  ): Promise<Result<void, FighterNotFoundError | UnknownApplicationError>>;
  abstract isDead(
    id: Y['id'],
  ): Promise<
    Result<{ isDead: boolean }, FighterNotFoundError | UnknownApplicationError>
  >;
}
