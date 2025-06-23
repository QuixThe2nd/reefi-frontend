import { useAllowances } from "./useAllowances";
import { useAmounts } from "./useAmounts";
import { useBalances } from "./useBalances";
import { useBonds } from "./useBonds";
import { useContracts } from "./useContracts";
import { useExchangeRates } from "./useExchangeRates";
import { usePrices } from "./usePrices";
import { useRewards } from "./useRewards";
import { useSupplies } from "./useSupplies";

export const useReefiState = () => {
  const contracts = useContracts();
  const [amounts, amountsActions] = useAmounts({ contracts });
  const prices = usePrices();
  const bonds = useBonds({ contracts });
  const allowances = useAllowances({ contracts });
  const balances = useBalances({ contracts });
  const supplies = useSupplies({ contracts });
  const exchangeRates = useExchangeRates({ contracts, supplies });
  const rewards = useRewards({ contracts, supplies, prices });

  return {
    amounts, amountsActions,
    allowances,
    balances,
    exchangeRates,
    prices,
    rewards,
    supplies,
    bonds
  } as const;
};
