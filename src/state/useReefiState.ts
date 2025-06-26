import { useAllowances, type Allowances } from "./useAllowances";
import { useAmounts, type Amounts } from "./useAmounts";
import { useBalances, type Balances } from "./useBalances";
import { useBonds, type Bond } from "./useBonds";
import { useContracts } from "./useContracts";
import { useExchangeRates, type ExchangeRates } from "./useExchangeRates";
import { usePrices, type Prices } from "./usePrices";
import { useRewards, type Rewards } from "./useRewards";
import { useSupplies, type Supplies } from "./useSupplies";

export interface ReefiState {
  balances: Balances;
  supplies: Supplies;
  allowances: Allowances;
  bonds: readonly Bond[];
  rewards: Rewards;
  prices: Prices;
  exchangeRates: ExchangeRates;
  amounts: Amounts[0];
  amountsActions: Amounts[1];
}

export const useReefiState = (): ReefiState => {
  const contracts = useContracts();
  const [amounts, amountsActions] = useAmounts({ contracts });
  const prices = usePrices();
  const bonds = useBonds({ contracts });
  const allowances = useAllowances({ contracts });
  const balances = useBalances({ contracts });
  const supplies = useSupplies({ contracts });
  const exchangeRates = useExchangeRates({ contracts, supplies, balances });
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
