import { useReducer, useCallback } from "react";

export const useAsyncReducer = <S> (reducer: () => Promise<S>, initialState: S): [S, () => void] => {
  const [asyncState, dispatch] = useReducer((_: S, action: S) => action, initialState);

  const asyncDispatch = useCallback(async () => {
    dispatch(await reducer());
  }, [reducer]);

  return [asyncState, asyncDispatch];
};
