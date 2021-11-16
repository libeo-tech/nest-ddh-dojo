import { CombatLog } from '../../../domain/combat-log/combat-log.entity';
import { mockFight } from '../../../domain/fight/fight.mock';
import { Fighter } from '../../../domain/fight/fighter.entity';
import { AttackCommand } from './attack.command';
import { AttackCommandHandler } from './attack.command-handler';

describe('attack command', () => {
  const logId = 'logId' as CombatLog<Fighter, Fighter>['id'];
  const attackValue = 10;
  const fightAdapter = {
    getAttackStrength: jest.fn().mockResolvedValue(attackValue),
    receiveDamage: jest.fn(),
    isDead: jest.fn(),
  };
  const fightIPAdapter = {
    getPorts: () => fightAdapter,
  };
  const attackHandler = new AttackCommandHandler(fightIPAdapter);

  it('should generate an attack based for hero', async () => {
    const attackCommand = new AttackCommand({
      fight: mockFight,
      logId,
    });
    await attackHandler.execute(attackCommand);

    const { attacker, defender } = mockFight;
    expect(fightAdapter.getAttackStrength).toHaveBeenCalledWith(attacker.id);
    expect(fightAdapter.receiveDamage).toHaveBeenCalledWith(defender.id, {
      source: 'attackerId',
      value: attackValue,
    });
  });
});
