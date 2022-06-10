import { EventBus, IEvent } from '@nestjs/cqrs';

export const eventBusMock = {
  publish: jest.fn<void, [IEvent]>(),
} as unknown as EventBus;
