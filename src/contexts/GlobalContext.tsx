import { createContext, use, useMemo, type ReactElement, type ReactNode } from "react";
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
  balances: UseBalances["balances"];
  updateBalances: UseBalances["updateBalances"];
  allowances: UseAllowances["allowances"];
  updateAllowances: UseAllowances["updateAllowances"];
  supplies: UseSupplies["supplies"];
  updateSupplies: UseSupplies["updateSupplies"];
  prices: UsePrices;
  writeContracts: UseContracts;
  locked: UseLocked["locked"];
  updateLocked: UseLocked["updateLocked"];
  exchangeRates: UseExchangeRates["exchangeRates"];
  amounts: UseAmounts["amounts"];
  updateAmounts: UseAmounts["updateAmounts"];
  rewards: UseRewards;
  withdraws: UseWithdraws["withdraws"];
  actions: UseActions;
}

interface GlobalProviderProperties {
  readonly children: ReactNode;
  readonly setError: (_message: string) => void;
  readonly setNotification: (_message: string) => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);
GlobalContext.displayName = "GlobalContext";

export const GlobalProvider = ({ children, setError, setNotification }: GlobalProviderProperties): ReactElement => {
  const wallet = useWallet({ setError });
  const { balances, updateBalances } = useBalances({ wallet });
  const { allowances, updateAllowances } = useAllowances({ wallet });
  const { amounts, updateAmounts } = useAmounts({ wallet });
  const { supplies, updateSupplies } = useSupplies({ wallet });
  const { locked, updateLocked } = useLocked({ wallet });
  const { withdraws, updateWithdraws } = useWithdraws({ wallet });
  const { exchangeRates } = useExchangeRates({ wallet });
  const prices = usePrices();
  const writeContracts = useContracts({ wallet });
  const rewards = useRewards({ balances, locked, prices, wallet });
  const actions = useActions({ allowances, amounts, rewards, setError, setNotification, updateAllowances, updateBalances, updateLocked, updateSupplies, updateWithdraws, wallet, writeContracts });
  const value = useMemo(() => ({ actions, allowances, amounts, balances, exchangeRates, locked, prices, rewards, supplies, updateAllowances, updateAmounts, updateBalances, updateLocked, updateSupplies, wallet, withdraws, writeContracts }), [actions, allowances, updateAllowances, amounts, balances, updateBalances, exchangeRates, locked, prices, rewards, supplies, wallet, withdraws, writeContracts]);
  return <GlobalContext value={value}>{children}</GlobalContext>;
};

export const useGlobalContext = (): GlobalContextType => {
  const context = use(GlobalContext);
  if (context === undefined) throw new Error("useGlobalContext must be used within a GlobalProvider");
  return context;
};
