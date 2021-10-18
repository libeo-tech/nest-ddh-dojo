export enum DragonColor {
  RED = 'red',
  GREEN = 'green',
  BLUE = 'blue',
  YELLOW = 'yellow',
  WHITE = 'white',
  BLACK = 'black',
}

export class Dragon {
  id: string & { __brand: 'dragonId' };
  level: number;
  color: DragonColor;
}
