import { ok } from 'neverthrow';
import { eventBusMock } from '../../../../../common/utils/test/event-bus.mock';
import { CombatLog } from '../../../domain/combat-log/combat-log.entity';
import { mockFight } from '../../../domain/fight/fight.mock';
import { Fighter } from '../../../domain/fight/fighter.entity';
import { AttackCommand } from './attack.command';
import { AttackCommandHandler } from './attack.command-handler';

describe('attack command', () => {
  const logId = 'logId' as CombatLog<Fighter, Fighter>['id'];
  const attackValue = 10;
  const fightAdapter = {
    getAttackStrength: jest.fn().mockResolvedValue(ok({ attackValue })),
    receiveDamage: jest.fn().mockResolvedValue(ok(void 0)),
    isDead: jest.fn().mockResolvedValue(ok({ isDead: false })),
  };
  const fightIPAdapter = {
    getPorts: () => {
      return {
        attackerPorts: fightAdapter,
        defenderPorts: fightAdapter,
      };
    },
  };
  const attackHandler = new AttackCommandHandler(fightIPAdapter, eventBusMock);

  it('should generate an attack based for hero', async () => {
    const attackCommand = new AttackCommand({
      fight: mockFight,
      logId,
      isRetaliate: false,
    });
    const result = await attackHandler.execute(attackCommand);
    expect(result.isOk()).toBeTruthy();

    const { attacker, defender } = mockFight;
    expect(fightAdapter.getAttackStrength).toHaveBeenCalledWith(attacker.id);
    expect(fightAdapter.receiveDamage).toHaveBeenCalledWith(defender.id, {
      source: 'attackerId',
      value: attackValue,
    });
    expect(fightAdapter.isDead).toHaveBeenCalledWith(defender.id);
  });
});
