import superjson from "superjson";
import { useLocalStorage, useObjectState } from "@uidotdev/usehooks";
import { useLoggedEffect } from "..";

const resetStates: string[] = [];

export const useStoredObject = <T = unknown>(key: string, initialValue: T) => {
  const [savedState, saveState] = useLocalStorage(key, superjson.stringify(initialValue));
  if (!resetStates.includes(key)) {
    resetStates.push(key);
    saveState(superjson.stringify(initialValue));
  }
  const [state, setState] = useObjectState<T>(superjson.parse<T>(savedState));
  useLoggedEffect(() => {
    saveState(superjson.stringify(state));
  }, [state, saveState], "useStoredObject");
  return [state, setState] as const;
};
