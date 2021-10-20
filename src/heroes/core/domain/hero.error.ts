import { Hero } from './hero.entity';

class HeroError extends Error {
  public heroId: Hero['id'];
  constructor(heroId: Hero['id'], message: string) {
    super(message);
    this.message = message;
    this.heroId = heroId;
  }
}

export class HeroNotFoundError extends HeroError {
  constructor(heroId: Hero['id']) {
    super(heroId, `Hero with id ${heroId} does not exist`);
  }
}

export class HeroDoesNotHaveEnoughXp extends HeroError {
  constructor(heroId: Hero['id']) {
    super(
      heroId,
      `Hero with id ${heroId} does not have enough xp to reach the next level`,
    );
  }
}
