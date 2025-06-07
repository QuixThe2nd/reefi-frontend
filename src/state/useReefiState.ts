import { useAllowances } from "./useAllowances";
import { useAmounts } from "./useAmounts";
import { useBalances } from "./useBalances";
import { useExchangeRates } from "./useExchangeRates";
import { usePrices } from "./usePrices";
import { useRewards } from "./useRewards";
import { useSupplies } from "./useSupplies";
import { useWallet } from "./useWallet";
import { useWithdraws } from "./useWithdraws";

export const useReefiState = ({ setError }: { setError: (_message: string) => void }) => {
  const [wallet, walletActions] = useWallet({ setError });
  const [balances] = useBalances({ wallet });
  const [rewards] = useRewards({ wallet });
  const [supplies] = useSupplies({ wallet });
  const [exchangeRates] = useExchangeRates({ wallet });
  const [prices] = usePrices();
  const [amounts, amountsActions] = useAmounts({ wallet });
  const [allowances] = useAllowances();
  const [withdraws] = useWithdraws();

  return {
    balances,
    rewards,
    supplies,
    exchangeRates,
    prices,
    allowances,
    amounts, amountsActions,
    wallet, walletActions,
    withdraws
  } as const;
};
