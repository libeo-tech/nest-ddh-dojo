import { DragonMockAdapter } from '../../../../infrastructure/mock/dragon.mock-adapter';
import { GenerateNewDragonCommand } from './generate-new-dragon.command';
import { GenerateNewDragonCommandHandler } from './generate-new-dragon.command-handler';

describe('generate new dragon command', () => {
  const dragonMockAdapter = new DragonMockAdapter();
  const generateNewDragonCommandHandler = new GenerateNewDragonCommandHandler(
    dragonMockAdapter,
  );

  beforeEach(() => {
    dragonMockAdapter.reset();
  });

  it('should create a new dragon', async () => {
    const command = new GenerateNewDragonCommand({});
    await generateNewDragonCommandHandler.execute(command);

    const dragons = await dragonMockAdapter.getAll();
    expect(dragons).toHaveLength(1);
    expect(dragons[0]).toHaveProperty('level');
    expect(dragons[0]).toHaveProperty('color');
  });
});
