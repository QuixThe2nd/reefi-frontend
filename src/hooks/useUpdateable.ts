import { useState, useEffect } from 'react'

export function useUpdateable<T>(_factory: () => T | Promise<T>, _deps: readonly unknown[], _initial: T): [T, () => void];
export function useUpdateable<T>(_factory: () => T | Promise<T>, _deps: readonly unknown[]): [T | undefined, () => void];
export function useUpdateable<T>(factory: () => T | Promise<T>, deps: readonly unknown[], initial?: T): [T | undefined, () => void] {
  const [updateCount, setUpdateCount] = useState(0);
  const [value, setValue] = initial !== undefined ? useState<T>(initial) : useState<T>();
  useEffect(() => {
    (async (): Promise<void> => {
      const newValue = await factory()
      setValue(newValue)
    })()
  }, [...deps, updateCount]);
  const update = (): void => setUpdateCount(c => c + 1);
  return [value, update];
}
