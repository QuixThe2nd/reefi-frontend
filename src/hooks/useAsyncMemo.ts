import { useEffect, useRef, useState } from "react";

export const useAsyncMemo = <T>(factory: () => Promise<T>, deps: React.DependencyList, initial: T): T => {
  const [data, setData] = useState<T>(initial);
  const cancelRef = useRef<() => void>(undefined);

  useEffect(() => {
    let cancelled = false;

    cancelRef.current = () => {
      cancelled = true;
    };

    factory().then(result => {
      if (!cancelled) setData(result);
    });

    return () => {
      cancelled = true;
    };
  }, deps);

  useEffect(() => () => {
    if (cancelRef.current) cancelRef.current();
  }, []);

  return data;
};
