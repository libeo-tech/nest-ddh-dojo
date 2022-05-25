import { filter, from, map, mergeMap, MonoTypeOperatorFunction } from 'rxjs';

export function asyncFilter<T>(
  predicate: (value: T) => Promise<boolean>,
): MonoTypeOperatorFunction<T> {
  return mergeMap((args) =>
    from(predicate(args)).pipe(
      filter(Boolean),
      map(() => args),
    ),
  );
}
