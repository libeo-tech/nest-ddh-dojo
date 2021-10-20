export class Hero {
  id: string & { __brand: 'heroId' };
  name: string;
  xp: number;
  level: number;
}
