import { useReducer } from "react";

export const useAsyncReducer = <S>(reducer: () => Promise<S>, initialState: S): [S, () => void] => {
  const [asyncState, dispatch] = useReducer((_: S, action: S) => action, initialState);

  const asyncDispatch = async () => dispatch(await reducer());

  return [asyncState, asyncDispatch];
};
