import { useEffect, useState, useCallback, useRef } from "react";

export const useAsyncReducer = <T> (asyncFunction: () => Promise<T>, deps: React.DependencyList, initialValue: T): [T, () => void] => {
  const [state, setState] = useState<T>(initialValue);

  const mountedReference = useRef(true);

  const execute = useCallback(async () => {
    const result = await asyncFunction();
    if (mountedReference.current) setState(result);
  }, [asyncFunction]);

  useEffect(() => {
    execute();
  }, deps);

  useEffect(() => () => {
    mountedReference.current = false;
  }, []);

  return [state, execute];
};
