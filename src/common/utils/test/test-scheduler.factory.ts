import { TestScheduler } from 'rxjs/testing';

const removeAfterHook = (frame: any): any => {
  delete frame?.notification?.value?.afterHook;
  return frame;
};

export const testSchedulerFactory = (): TestScheduler => {
  return new TestScheduler((actual, expected) =>
    expect(actual.map(removeAfterHook)).toStrictEqual(
      expected.map(removeAfterHook),
    ),
  );
};
