import { createContext, useContext, type ReactNode, type ReactElement } from 'react'
import { useWallet, type UseWallet } from '../hooks/useWallet'
import { useBalances, type UseBalances } from '../hooks/useBalances'
import { useAllowances, type UseAllowances } from '../hooks/useAllowances'
import { UseActions, useActions } from '../hooks/useActions'
import { UseAmounts, useAmounts } from '../hooks/useAmounts'
import { UseContracts, useContracts } from '../hooks/useContracts'
import { UseExchangeRates, useExchangeRates } from '../hooks/useExchangeRates'
import { UseLocked, useLocked } from '../hooks/useLocked'
import { UsePrices, usePrices } from '../hooks/usePrices'
import { UseSupplies, useSupplies } from '../hooks/useSupplies'
import { UseWithdraws, useWithdraws } from '../hooks/useWithdraws'
import { UseRewards, useRewards } from '../hooks/useRewards'
import { Pages } from '../App'

interface GlobalContextType<W extends UseWallet = UseWallet> {
  wallet: W
  balances: UseBalances
  allowances: UseAllowances
  supplies: UseSupplies
  prices: UsePrices
  writeContracts: UseContracts<W['clients']>
  locked: UseLocked
  exchangeRates: UseExchangeRates
  amounts: UseAmounts
  rewards: UseRewards
  withdraws: UseWithdraws
  actions: UseActions
}

interface GlobalProviderProps {
  readonly children: ReactNode
  readonly page: Pages
  readonly setError: (_msg: string) => void
  readonly setNotification: (_msg: string) => void
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined)

export const GlobalProvider = ({ children, page, setError, setNotification }: GlobalProviderProps): ReactElement => {
  const wallet = useWallet({ setError })
  const balances = useBalances({ wallet })
  const allowances = useAllowances({ wallet })
  const supplies = useSupplies({ wallet })
  const prices = usePrices()
  const writeContracts = useContracts({ wallet })
  const locked = useLocked({ wallet })
  const amounts = useAmounts({ wallet })
  const withdraws = useWithdraws({ wallet })
  const exchangeRates = useExchangeRates({ wallet, locked, supplies })
  const rewards = useRewards({ wallet, prices, balances, locked })
  const actions = useActions({ page, setError, setNotification, wallet, balances, allowances, supplies, writeContracts, locked, amounts, withdraws, rewards })
  return <GlobalContext.Provider value={{ wallet, balances, allowances, supplies, prices, writeContracts, locked, exchangeRates, amounts, rewards, withdraws, actions }}>{children}</GlobalContext.Provider>
}

export const useGlobalContext = (): GlobalContextType => {
  const context = useContext(GlobalContext)
  if (context === undefined) throw new Error('useGlobalContext must be used within a GlobalProvider')
  return context
}