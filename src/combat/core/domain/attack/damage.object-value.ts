import { Fighter } from '../fight/fighter.entity';

export type Damage<T extends Fighter> = {
  value: number;
  source: T['id'];
};
