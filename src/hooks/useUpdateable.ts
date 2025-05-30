import { useState, useEffect } from 'react'
import superjson from 'superjson';

const depUpdateLog: string[] = []
const manUpdateLog: string[] = []

function useUpdateable<T>(_factory: () => T | Promise<T>, _deps: readonly unknown[], _label: string, _initial: T): [T, () => void];
function useUpdateable<T>(_factory: () => T | Promise<T>, _deps: readonly unknown[], _label: string): [T | undefined, () => void];
function useUpdateable<T>(factory: () => T | Promise<T>, deps: readonly unknown[], label: string, initial?: T): [T | undefined, () => void] {
  const [updateCount, setUpdateCount] = useState(0);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [value, setValue] = initial === undefined ? useState<T>() : useState<T>(initial);
  useEffect(() => {
    (async (): Promise<void> => {
      const newValue = await factory()
      if (newValue !== undefined) setValue(newValue)
    })()
  }, [...deps, updateCount]);

  useEffect(() => {
    if (depUpdateLog.includes(label)) console.log(`${label} deps updated: ${value}`)
    else depUpdateLog.push(label)
  }, deps)
  useEffect(() => {
    if (manUpdateLog.includes(label)) console.log(`${label} manually updated: ${value}`)
    else manUpdateLog.push(label)
  }, [updateCount])

  const update = (): void => setUpdateCount(c => c + 1);
  return [value, update];
}

export function useCachedUpdateable<T>(_factory: () => T | Promise<T>, _deps: readonly unknown[], _label: string, _initial: T): [T, () => void];
export function useCachedUpdateable<T>(_factory: () => T | Promise<T>, _deps: readonly unknown[], _label: string): [T | undefined, () => void];
export function useCachedUpdateable<T>(factory: () => T | Promise<T>, deps: readonly unknown[], label: string, initial?: T): [T | undefined, () => void] {
  const item = localStorage.getItem(label)
  if (item !== null) initial = superjson.parse(item) as T
  const updateable = useUpdateable(factory, deps, label, initial)
  useEffect(() => {
    if (updateable[0] !== undefined) localStorage.setItem(label, superjson.stringify(updateable[0]))
  }, [updateable[0]])
  return updateable
}
