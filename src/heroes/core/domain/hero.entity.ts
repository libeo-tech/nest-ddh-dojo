import { Base } from '../../../common/core/domain/base.entity';

export class Hero extends Base {
  id: string & { __brand: 'heroId' };
  name: string;
  xp: number;
  level: number;
}
