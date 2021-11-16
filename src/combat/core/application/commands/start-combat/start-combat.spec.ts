import { eventBusMock } from '../../../../../common/utils/test/event-bus.mock';
import { Dragon } from '../../../../../dragons/core/domain/dragon.entity';
import { Hero } from '../../../../../heroes/core/domain/hero.entity';
import { CombatLog } from '../../../domain/combat-log/combat-log.entity';
import { Fighter, FighterType } from '../../../domain/fight/fighter.entity';
import { NewCombatRoundEvent } from '../../sagas/combat.event';
import { StartCombatCommand } from './start-combat.command';
import { StartCombatCommandHandler } from './start-combat.command-handler';

describe('startCombat command', () => {
  const logId = 'logId' as CombatLog<Fighter, Fighter>['id'];
  const combatLogAdapter = {
    create: jest.fn().mockResolvedValue({ id: logId }),
    logRound: jest.fn(),
    logOutcome: jest.fn(),
  };
  const combatLogIPAdapter = {
    getPorts: () => combatLogAdapter,
  };
  const startCombatHandler = new StartCombatCommandHandler(
    combatLogIPAdapter,
    eventBusMock,
  );

  it('should generate an startCombat based for hero', async () => {
    const attacker: Fighter = {
      id: 'attackerId' as Hero['id'],
      type: FighterType.HERO,
    };
    const defender: Fighter = {
      id: 'defenderId' as Dragon['id'],
      type: FighterType.DRAGON,
    };
    const startCombatCommand = new StartCombatCommand({ attacker, defender });
    await startCombatHandler.execute(startCombatCommand);

    expect(combatLogAdapter.create).toHaveBeenCalledWith(
      attacker.id,
      defender.id,
    );
    expect(eventBusMock.publish).toHaveBeenCalledWith(
      new NewCombatRoundEvent({ fight: { attacker, defender }, logId }),
    );
  });
});
