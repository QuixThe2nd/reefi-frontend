import superjson from "superjson";
import { useEffect, useState } from "react";

type FactoryResult<T> = T | undefined | Promise<T | undefined>;
function useUpdateable<T> (_factory: () => FactoryResult<T>, _deps: readonly unknown[], _initial: T | undefined): [T, () => void];
function useUpdateable<T> (_factory: () => FactoryResult<T>, _deps: readonly unknown[]): [T | undefined, () => void];
// eslint-disable-next-line func-style
function useUpdateable<T> (factory: () => FactoryResult<T>, deps: readonly unknown[], initial?: T): [T | undefined, () => void] {
  const [updateCount, setUpdateCount] = useState(0);
  const [value, setValue] = useState<T | undefined>(initial);
  useEffect(() => {
    (async (): Promise<void> => {
      const newValue = await factory();
      if (newValue !== undefined) setValue(newValue);
    })();
  }, [...deps, updateCount]);

  const update = (): void => {
    setUpdateCount(c => c + 1);
  };
  return [value, update];
}

export function useCachedUpdateable<T> (_factory: () => T | Promise<T>, _deps: readonly unknown[], _label: string, _initial: T): [T, () => void];
export function useCachedUpdateable<T> (_factory: () => T | Promise<T>, _deps: readonly unknown[], _label: string): [T | undefined, () => void];
// eslint-disable-next-line func-style
export function useCachedUpdateable<T> (factory: () => T | Promise<T>, deps: readonly unknown[], label: string, initial?: T): [T | undefined, () => void] {
  const item = localStorage.getItem(label);
  const initialValue = item === null ? initial : superjson.parse<T>(item);

  const updateable = useUpdateable<T>(factory, deps, initialValue);
  useEffect(() => {
    if (updateable[0] !== undefined) localStorage.setItem(label, superjson.stringify(updateable[0]));
  }, [updateable[0]]);
  return updateable;
}
