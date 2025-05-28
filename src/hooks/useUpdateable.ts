import { useState, useEffect } from 'react'

const depUpdateLog: string[] = []
const manUpdateLog: string[] = []

export function useUpdateable<T>(_factory: () => T | Promise<T>, _deps: readonly unknown[], _label: string, _initial: T): [T, () => void];
export function useUpdateable<T>(_factory: () => T | Promise<T>, _deps: readonly unknown[], _label: string): [T | undefined, () => void];
export function useUpdateable<T>(factory: () => T | Promise<T>, deps: readonly unknown[], label: string, initial?: T): [T | undefined, () => void] {
  const [updateCount, setUpdateCount] = useState(0);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [value, setValue] = initial === undefined ? useState<T>() : useState<T>(initial);
  useEffect(() => {
    (async (): Promise<void> => {
      const newValue = await factory()
      setValue(newValue)
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
