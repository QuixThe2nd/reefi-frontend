import { useActions } from "./useActions";
import { useAllowances } from "./useAllowances";
import { useAmounts } from "./useAmounts";
import { useBalances } from "./useBalances";
import { useContracts } from "./useContracts";
import { useExchangeRates } from "./useExchangeRates";
import { usePrices } from "./usePrices";
import { useRewards } from "./useRewards";
import { useSupplies } from "./useSupplies";
import { useWallet } from "./useWallet";
import { useWithdraws } from "./useWithdraws";

export const useReefiState = ({ setError, setNotification }: { setError: (_message: string) => void; setNotification: (_message: string) => void }) => {
  const [wallet, updateWallet] = useWallet({ setError });
  const [exchangeRates] = useExchangeRates({ wallet });
  const contracts = useContracts({ wallet });
  const [balances, updateBalances] = useBalances({ wallet });
  const [supplies, updateSupplies] = useSupplies({ wallet });
  const [amounts, amountsActions] = useAmounts({ wallet });
  const [allowances, updateAllowances] = useAllowances({ wallet });
  const [prices] = usePrices();
  const [rewards] = useRewards({ wallet, prices });
  const [withdraws] = useWithdraws();
  const actions = useActions({ wallet, updateWallet, contracts, amounts, allowances, updateAllowances, setError, updateBalances, updateSupplies, setNotification });

  return {
    balances,
    contracts,
    rewards,
    supplies,
    exchangeRates,
    prices,
    allowances,
    amounts, amountsActions,
    wallet, updateWallet,
    withdraws,
    actions
  } as const;
};
