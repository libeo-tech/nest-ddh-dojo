import { EventBus } from '@nestjs/cqrs';

export const eventBusMock = {
  publish: jest.fn<void, [Event]>(),
} as unknown as EventBus;
