import { Dragon } from '../../../../../dragons/core/domain/dragon.entity';
import { Hero } from '../../../../../heroes/core/domain/hero.entity';
import { CombatLog } from '../../../domain/combat-log/combat-log.entity';
import { Fighter, FighterType } from '../../../domain/fight/fighter.entity';
import { AttackCommand } from './attack.command';
import { AttackCommandHandler } from './attack.command-handler';

describe('attack command', () => {
  const logId = 'logId' as CombatLog<Fighter, Fighter>['id'];
  const attackValue = 10;
  const fightAdapter = {
    getAttackStrength: jest.fn().mockResolvedValue(attackValue),
    inflictDamage: jest.fn(),
    isDead: jest.fn(),
  };
  const fightIPAdapter = {
    getPorts: () => fightAdapter,
  };
  const attackHandler = new AttackCommandHandler(fightIPAdapter);

  it('should generate an attack based for hero', async () => {
    const attacker: Fighter = {
      id: 'attackerId' as Hero['id'],
      type: FighterType.HERO,
    };
    const defender: Fighter = {
      id: 'defenderId' as Dragon['id'],
      type: FighterType.DRAGON,
    };
    const attackCommand = new AttackCommand({
      fight: { attacker, defender },
      logId,
    });
    await attackHandler.execute(attackCommand);

    expect(fightAdapter.getAttackStrength).toHaveBeenCalledWith(attacker.id);
    expect(fightAdapter.inflictDamage).toHaveBeenCalledWith(defender.id, {
      source: 'attackerId',
      value: attackValue,
    });
  });
});
