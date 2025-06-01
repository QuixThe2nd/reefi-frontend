import { createContext, useContext, type ReactElement, type ReactNode } from "react";
import { useActions, UseActions } from "../hooks/useActions";
import { useAllowances, type UseAllowances } from "../hooks/useAllowances";
import { useAmounts, UseAmounts } from "../hooks/useAmounts";
import { useBalances, type UseBalances } from "../hooks/useBalances";
import { useContracts, UseContracts } from "../hooks/useContracts";
import { useExchangeRates, UseExchangeRates } from "../hooks/useExchangeRates";
import { useLocked, UseLocked } from "../hooks/useLocked";
import { usePrices, UsePrices } from "../hooks/usePrices";
import { useRewards, UseRewards } from "../hooks/useRewards";
import { useSupplies, UseSupplies } from "../hooks/useSupplies";
import { useWallet, type UseWallet } from "../hooks/useWallet";
import { useWithdraws, UseWithdraws } from "../hooks/useWithdraws";

interface GlobalContextType<W extends UseWallet = UseWallet> {
  wallet: W;
  balances: UseBalances;
  allowances: UseAllowances;
  supplies: UseSupplies;
  prices: UsePrices;
  writeContracts: UseContracts<W["clients"]>;
  locked: UseLocked;
  exchangeRates: UseExchangeRates;
  amounts: UseAmounts;
  rewards: UseRewards;
  withdraws: UseWithdraws;
  actions: UseActions;
}

interface GlobalProviderProperties {
  readonly children: ReactNode;
  readonly setError: (_message: string) => void;
  readonly setNotification: (_message: string) => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider = ({ children, setError, setNotification }: GlobalProviderProperties): ReactElement => {
  const wallet = useWallet({ setError });
  const balances = useBalances({ wallet });
  const allowances = useAllowances({ wallet });
  const supplies = useSupplies({ wallet });
  const prices = usePrices();
  const writeContracts = useContracts({ wallet });
  const locked = useLocked({ wallet });
  const amounts = useAmounts({ wallet });
  const withdraws = useWithdraws({ wallet });
  const exchangeRates = useExchangeRates({ locked, supplies, wallet });
  const rewards = useRewards({ balances, locked, prices, wallet });
  const actions = useActions({ allowances, amounts, balances, locked, rewards, setError, setNotification, supplies, wallet, withdraws, writeContracts });
  return <GlobalContext.Provider value={{ actions, allowances, amounts, balances, exchangeRates, locked, prices, rewards, supplies, wallet, withdraws, writeContracts }}>{children}</GlobalContext.Provider>;
};

export const useGlobalContext = (): GlobalContextType => {
  const context = useContext(GlobalContext);
  if (context === undefined) throw new Error("useGlobalContext must be used within a GlobalProvider");
  return context;
};
