import { DragonMockAdapter } from '../../ports/dragon.mock-adapter';
import { GenerateRandomDragonCommandHandler } from './generate-random-dragon.command-handler';

describe('generate random dragon command', () => {
  const dragonMockAdapter = new DragonMockAdapter();
  const generateRandomDragonCommandHandler =
    new GenerateRandomDragonCommandHandler(dragonMockAdapter);

  it('should create a random dragon', async () => {
    await generateRandomDragonCommandHandler.execute();

    const dragons = await dragonMockAdapter.getAllDragons();
    expect(dragons).toHaveLength(1);
    expect(dragons[0]).toHaveProperty('level');
    expect(dragons[0]).toHaveProperty('color');
    dragonMockAdapter.deleteDragon(dragons[0].id);
  });
});
