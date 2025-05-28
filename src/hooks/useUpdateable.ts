import { useState, useEffect } from 'react'

export function useUpdateable<T>(factory: () => Promise<T>, deps: unknown[]): [T | undefined, () => void] {
  const [updateCount, setUpdateCount] = useState(0);
  const [value, setValue] = useState<T>();
  useEffect(() => {
    factory().then(setValue).catch(console.error)
  }, [...deps, updateCount]);
  const update = (): void => setUpdateCount(c => c + 1);
  return [value, update];
}
