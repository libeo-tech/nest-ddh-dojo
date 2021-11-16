import {
  DragonFighter,
  Fighter,
  HeroFighter,
  isFighterADragon,
  isFighterAHero,
} from './fighter.entity';

export type Fight<X extends Fighter, Y extends Fighter> = {
  attacker: X;
  defender: Y;
};
export type PvEFight = Fight<HeroFighter, DragonFighter>;
export type PvPFight = Fight<HeroFighter, HeroFighter>;

export const isPvEFight = (
  fight: Fight<Fighter, Fighter>,
): fight is PvEFight => {
  const { attacker, defender } = fight;
  return isFighterAHero(attacker) && isFighterADragon(defender);
};

export const isPvPFight = (
  fight: Fight<Fighter, Fighter>,
): fight is PvEFight => {
  const { attacker, defender } = fight;
  return isFighterAHero(attacker) && isFighterAHero(defender);
};

export const reverseFight = <X extends Fighter, Y extends Fighter>(
  fight: Fight<X, Y>,
): Fight<Y, X> => {
  const { attacker, defender } = fight;
  return {
    attacker: defender,
    defender: attacker,
  };
};
