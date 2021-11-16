import { generateRandomNumber } from '../../../../common/utils/random/random-number';
import { getRewardFromDragon } from './reward.service';

describe('reward', () => {
  it('should return a reward for slaying a dragon', () => {
    const dragonLevel = generateRandomNumber(1, 10);
    const reward = getRewardFromDragon(dragonLevel);

    expect(reward).toBeDefined();
    expect(reward).toHaveProperty('xpGain');
  });
});
