import superjson from "superjson";
import { useEffect } from "react";
import { useLocalStorage, useObjectState } from "@uidotdev/usehooks";

const resetStates: string[] = [];

export const useStoredObject = <T = unknown>(key: string, initialValue: T) => {
  const [savedState, saveState] = useLocalStorage(key, superjson.stringify(initialValue));
  if (!resetStates.includes(key)) {
    resetStates.push(key);
    saveState(superjson.stringify(initialValue));
  }
  const [state, setState] = useObjectState<T>(superjson.parse<T>(savedState));
  useEffect(() => {
    saveState(superjson.stringify(state));
  }, [state, saveState]);
  return [state, setState] as const;
};
