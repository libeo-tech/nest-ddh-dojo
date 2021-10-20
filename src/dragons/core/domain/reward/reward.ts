import { Dragon } from '../dragon.entity';

export type Reward = {
  xpGain: number;
};

export const rewardFactory = (dragonLevel: Dragon['level']): Reward => {
  return { xpGain: dragonLevel * 10 };
};
