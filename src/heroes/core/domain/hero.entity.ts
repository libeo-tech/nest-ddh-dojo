export class Hero {
  id: string & { __brand: 'heroId' };
  level: number;
  name: string;
}
