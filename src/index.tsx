import { arbitrum, bsc } from "wagmi/chains";
import { createStorage, WagmiProvider, webSocket } from "wagmi";
import { getDefaultConfig, RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { useReefiState, type ReefiState } from "./state/useReefiState";

import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { createContext } from "react";
import ReactDOM from "react-dom/client";

const queryClient = new QueryClient();

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

export const ReefiContext = createContext<ReefiState>({} as ReefiState);

const AppContext = () => {
  const reefiState = useReefiState();
  ReefiContext.displayName = "ReefiContext";
  return <ReefiContext value={reefiState}>
    <App />
  </ReefiContext>;
};

ReactDOM.createRoot(document.querySelector("#root")!).render(<React.StrictMode>
  <WagmiProvider config={wagmiConfig}>
    <QueryClientProvider client={queryClient}>
      <RainbowKitProvider showRecentTransactions theme={darkTheme()}>
        <AppContext />
      </RainbowKitProvider>
    </QueryClientProvider>
  </WagmiProvider>
</React.StrictMode>);
