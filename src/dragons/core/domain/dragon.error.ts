import { Dragon } from './dragon.entity';

class DragonError extends Error {
  public dragonId: Dragon['id'];
  constructor(dragonId: Dragon['id'], message: string) {
    super(message);
    this.message = message;
    this.dragonId = dragonId;
  }
}

export class DragonNotFoundError extends DragonError {
  constructor(dragonId: Dragon['id']) {
    super(dragonId, `Dragon with id ${dragonId} does not exist`);
  }
}
