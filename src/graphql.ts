/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export enum ColorEnum {
  RED = 'RED',
  GREEN = 'GREEN',
  BLUE = 'BLUE',
  YELLOW = 'YELLOW',
  WHITE = 'WHITE',
  BLACK = 'BLACK',
}

export interface IMutation {
  attackDragon(heroId: string, dragonId: string): boolean | Promise<boolean>;
  generateRandomDragon(): boolean | Promise<boolean>;
  createHero(name: string): boolean | Promise<boolean>;
}

export interface Dragon {
  id: string;
  level: number;
  color?: Nullable<ColorEnum>;
  currentHp: number;
}

export interface IQuery {
  getAllDragons(): Dragon[] | Promise<Dragon[]>;
  getHero(id: string): Hero | Promise<Hero>;
  getAllItems(): Item[] | Promise<Item[]>;
}

export interface Hero {
  id: string;
  name: string;
  xp: number;
  level: number;
  currentHp: number;
  inventory?: Nullable<Nullable<Item>[]>;
}

export interface Item {
  id: string;
  name: string;
}

type Nullable<T> = T | null;
