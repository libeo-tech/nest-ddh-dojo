import { Dragon } from '../../../../dragons/core/domain/dragon.entity';

export type Reward = {
  xpGain: number;
};

export const getRewardFromDragon = (dragonLevel: Dragon['level']): Reward => {
  return { xpGain: dragonLevel * 10 };
};
