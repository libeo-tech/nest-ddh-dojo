import { eventBusMock } from '../../../../../common/utils/test/event-bus.mock';
import { Fighter } from '../../../domain/fight/fighter.entity';
import { AttackCommand } from './attack.command';
import { AttackCommandHandler } from './attack.command-handler';

describe('attack command', () => {
  const fightAdapter = {
    getById: jest.fn(),
    inflictDamage: jest.fn(),
    isDead: jest.fn(),
  };
  const attackHandler = new AttackCommandHandler(fightAdapter, eventBusMock);

  it('should generate an attack based for hero', async () => {
    const attackerId = 'attackerId' as Fighter['id'];
    const defenderId = 'defenderId' as Fighter['id'];
    await attackHandler.execute(
      new AttackCommand({ fight: { attackerId, defenderId } }),
    );

    expect(fightAdapter.getById).toHaveBeenCalledWith(attackerId);
  });
});
