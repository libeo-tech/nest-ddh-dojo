import { NextNotification, ObservableNotification } from 'rxjs';
import { TestMessage } from 'rxjs/internal/testing/TestMessage';
import { TestScheduler } from 'rxjs/testing';

const isNextNotification = <T>(
  notification: ObservableNotification<T>,
): notification is NextNotification<T> => {
  return 'value' in notification;
};

const removeAfterHook = (frame: TestMessage): TestMessage => {
  if (isNextNotification(frame.notification)) {
    delete frame.notification.value?.afterHook;
  }
  return frame;
};

export const testSchedulerFactory = (): TestScheduler => {
  return new TestScheduler((actual, expected) =>
    expect(actual.map(removeAfterHook)).toStrictEqual(
      expected.map(removeAfterHook),
    ),
  );
};
