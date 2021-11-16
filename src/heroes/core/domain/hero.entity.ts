import { Base } from '../../../common/core/domain/base.entity';

export const getHeroMaxHp = (level: Hero['level']): number => {
  return level * 10;
};

export class Hero extends Base {
  id: string & { __brand: 'heroId' };
  name: string;
  xp: number;
  level: number;
  currentHp: number;
}
