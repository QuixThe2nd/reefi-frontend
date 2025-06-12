import { arbitrum, bsc } from "wagmi/chains";
import { createStorage, WagmiProvider, webSocket } from "wagmi";
import { getDefaultConfig, RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";

import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { type DependencyList, type EffectCallback } from "react";
import ReactDOM from "react-dom/client";

// const originalUseState = React.useState;
// const originalUseCallback = React.useCallback;
// const originalUseMemo = React.useMemo;

const queryClient = new QueryClient();

export const useLoggedEffect = (effect: EffectCallback, deps: DependencyList | undefined, name: string) => React.useEffect(() => {
  console.log(`useEffect ${name} executing with deps:`, deps);
  return effect();
}, deps);
// React.useState = <S,>(initialState?: S | (() => S)) => {
//   const [state, setState] = initialState === undefined ? originalUseState<S>() : originalUseState<S>(initialState);
//   return [
//     state,
//     (newState: React.SetStateAction<S>) => {
//       console.log("setState called:", newState);
//       setState(newState);
//     }
//   ] as [S, React.Dispatch<React.SetStateAction<S>>];
// };
// React.useCallback = <T extends () => void>(callback: T, deps: React.DependencyList) => {
//   console.log("useCallback called with deps:", deps);
//   return originalUseCallback(callback, deps);
// };
// React.useMemo = (factory, deps) => {
//   console.log("useMemo called with deps:", deps);
//   return originalUseMemo(factory, deps);
// };

export const wagmiConfig = getDefaultConfig({
  appName: "Reefi",
  projectId: "909c14637167df7a4faff136533edb7e",
  chains: [arbitrum, bsc],
  storage: createStorage({ storage: window.localStorage }),
  transports: {
    [arbitrum.id]: webSocket("wss://arbitrum.drpc.org"),
    [bsc.id]: webSocket("wss://bsc.drpc.org")
  }
});

declare module "wagmi" {
  interface Register {
    config: typeof wagmiConfig;
  }
}

ReactDOM.createRoot(document.querySelector("#root")!).render(<React.StrictMode>
  <WagmiProvider config={wagmiConfig}>
    <QueryClientProvider client={queryClient}>
      <RainbowKitProvider showRecentTransactions theme={darkTheme()}>
        <App />
      </RainbowKitProvider>
    </QueryClientProvider>
  </WagmiProvider>
</React.StrictMode>);
// ReactDOM.createRoot(document.querySelector('#root') as HTMLElement).render(<App />)
