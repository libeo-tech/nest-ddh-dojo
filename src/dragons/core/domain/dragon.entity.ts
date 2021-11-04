import { Base } from '../../../common/core/domain/base.entity';

export enum DragonColor {
  RED = 'red',
  GREEN = 'green',
  BLUE = 'blue',
  YELLOW = 'yellow',
  WHITE = 'white',
  BLACK = 'black',
}

export class Dragon extends Base {
  id: string & { __brand: 'dragonId' };
  level: number;
  color: DragonColor;
}
