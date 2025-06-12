import { useAllowances } from "./useAllowances";
import { useAmounts } from "./useAmounts";
import { useBalances } from "./useBalances";
import { useExchangeRates } from "./useExchangeRates";
import { usePrices } from "./usePrices";
import { useRewards } from "./useRewards";
import { useSupplies } from "./useSupplies";
import { useWithdraws } from "./useWithdraws";

export const useReefiState = () => {
  const [amounts, amountsActions] = useAmounts();
  const prices = usePrices();

  return {
    amounts, amountsActions,
    allowances: useAllowances(),
    balances: useBalances(),
    exchangeRates: useExchangeRates(),
    prices,
    rewards: useRewards({ prices }),
    supplies: useSupplies(),
    withdraws: useWithdraws()
  } as const;
};
