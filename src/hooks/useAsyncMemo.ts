import { useLoggedEffect } from "..";
import { useRef, useState } from "react";

type UseCallbackResult<T extends () => void> = T & { __useCallbackBrand: never };

declare module "react" {
  function useCallback<T extends () => void> (_callback: T, _deps: DependencyList): UseCallbackResult<T>;
}

export const useAsyncMemo = <Value, Callback extends () => Promise<Value> = () => Promise<Value>>(factory: UseCallbackResult<Callback>, initial: Value): Value => {
  const [data, setData] = useState<Value>(initial);
  const cancelRef = useRef<() => void>(undefined);

  useLoggedEffect(() => {
    (async () => setData(await factory()))();
  }, [factory], "useAsyncMemo populate");

  useLoggedEffect(() => {
    if (cancelRef.current) cancelRef.current();
  }, [], "useAsyncMemo cancel");

  return data;
};
