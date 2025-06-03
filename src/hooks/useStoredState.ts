import superjson from "superjson";
import { useEffect } from "react";
import { useLocalStorage, useObjectState } from "@uidotdev/usehooks";

export const useStoredObject = <T = unknown>(key: string, initialValue: T) => {
  const [savedState, saveState] = useLocalStorage(key, superjson.stringify(initialValue));
  const [state, setState] = useObjectState<T>(superjson.parse<T>(savedState));
  useEffect(() => {
    saveState(superjson.stringify(state));
  }, [state, saveState]);
  return [state, setState] as const;
};
