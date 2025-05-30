import { UseAllowances } from "./useAllowances"
import { UseBalances } from "./useBalances"
import { UseSupplies } from "./useSupplies"
import { useApprove } from "./actions/useApprove"
import { useBuyRMGP } from "./actions/useBuyRMGP"
import { useDepositRMGP } from "./actions/useDepositRMGP"
import { useCompoundRMGP } from "./actions/useCompoundRMGP"
import { useClaimYMGPRewards } from "./actions/useClaimYMGPRewards"
import { useSupplyLiquidity } from "./actions/useSupplyLiquidity"
import { useDepositMGP } from "./actions/useDepositMGP"
import { useBuyYMGP } from "./actions/useBuyYMGP"
import { useBuyMGP } from "./actions/useBuyMGP"
import { useLockYMGP } from "./actions/useLockYMGP"
import { useUnlockYMGP } from "./actions/useUnlockYMGP"
import { useRedeemRMGP } from "./actions/useRedeemRMGP"
import { useWithdrawMGP } from "./actions/useWithdrawMGP"
import { UseAmounts } from "./useAmounts"
import { UseLocked } from "./useLocked"
import { UseRewards } from "./useRewards"
import { UseWallet } from "./useWallet"
import { UseWithdraws } from "./useWithdraws"
import { UseContracts } from "./useContracts"
import { Pages } from "../App"
import { useSwap } from "./actions/useSwap"
import { Coins } from "../config/contracts"
import { useMintWETH } from "./actions/useMintWETH"
import { useSellRMGP } from "./actions/useSellRMGP"
import { useConvertMGP } from "./actions/useConvertMGP"

interface Props<W extends UseWallet> {
  page: Pages
  setError: (_msg: string) => void
  setNotification: (_msg: string) => void
  wallet: W
  balances: UseBalances
  allowances: UseAllowances
  supplies: UseSupplies
  writeContracts: UseContracts<W['clients']>
  locked: UseLocked
  amounts: UseAmounts
  rewards: UseRewards
  withdraws: UseWithdraws
}

export interface UseActions {
  approve: (_contract: 'rMGP' | 'yMGP' | 'cMGP' | 'ODOSRouter', _coin: Coins, _infinity: boolean) => void
  depositMGP: () => void
  buyRMGP: () => void
  buyYMGP: () => void
  convertMGP: () => void
  buyMGP: () => void
  depositRMGP: () => void
  lockYMGP: () => void
  unlockYMGP: () => void
  redeemRMGP: () => void
  withdrawMGP: () => void
  compoundRMGP: () => void
  claimYMGPRewards: () => void
  supplyLiquidity: () => void
  swap: (_tokenIn: `0x${string}`, _tokenOut: `0x${string}`) => void
  mintWETH: () => void
  sellYMGP: () => void
}

export const useActions = <W extends UseWallet>({ page, setError, setNotification, wallet, balances, allowances, supplies, writeContracts, locked, amounts, withdraws, rewards }: Props<W>): UseActions => {
  const approve = useApprove({ account: wallet.account, allowances, chain: wallet.chain, clients: wallet.clients, page, sendAmount: amounts.send, setConnectRequired: wallet.setConnectRequired, writeContracts })
  const depositMGP = useDepositMGP({ account: wallet.account, allowances, balances, chain: wallet.chain, clients: wallet.clients, sendAmount: amounts.send, setConnectRequired: wallet.setConnectRequired, setError, supplies, updateReefiLockedMGP: locked.updateReefiMGP, updateTotalLockedMGP: locked.updateMGP, writeContracts })
  const buyRMGP = useBuyRMGP({ account: wallet.account, allowances, balances, chain: wallet.chain, clients: wallet.clients, sendAmount: amounts.send, setConnectRequired: wallet.setConnectRequired, setError, writeContracts })
  const sellYMGP = useSellRMGP({ account: wallet.account, allowances, balances, chain: wallet.chain, clients: wallet.clients, sendAmount: amounts.send, setConnectRequired: wallet.setConnectRequired, setError, writeContracts })
  const buyYMGP = useBuyYMGP({ account: wallet.account, allowances, balances, chain: wallet.chain, clients: wallet.clients, sendAmount: amounts.send, setConnectRequired: wallet.setConnectRequired, setError, writeContracts })
  const convertMGP = useConvertMGP({ account: wallet.account, allowances, balances, chain: wallet.chain, clients: wallet.clients, sendAmount: amounts.send, setConnectRequired: wallet.setConnectRequired, setError, writeContracts })
  const buyMGP = useBuyMGP({ account: wallet.account, allowances, balances, chain: wallet.chain, clients: wallet.clients, sendAmount: amounts.send, setConnectRequired: wallet.setConnectRequired, setError, writeContracts })
  const depositRMGP = useDepositRMGP({ account: wallet.account, allowances, balances, chain: wallet.chain, clients: wallet.clients, sendAmount: amounts.send, setConnectRequired: wallet.setConnectRequired, setError, supplies, updateYMGPHoldings: balances.updateYMGPHoldings, writeContracts })
  const lockYMGP = useLockYMGP({ account: wallet.account, chain: wallet.chain, clients: wallet.clients, sendAmount: amounts.send, setConnectRequired: wallet.setConnectRequired, supplies, updateTotalLockedYMGP: locked.updateMGP, updateUserLockedYMGP: locked.updateUserYMGP, writeContracts })
  const unlockYMGP = useUnlockYMGP({ account: wallet.account, chain: wallet.chain, clients: wallet.clients, sendAmount: amounts.send, setConnectRequired: wallet.setConnectRequired, supplies, updateTotalLockedYMGP: locked.updateMGP, updateUserLockedYMGP: locked.updateUserYMGP, writeContracts })
  const redeemRMGP = useRedeemRMGP({ account: wallet.account, balances, chain: wallet.chain, clients: wallet.clients, sendAmount: amounts.send, setConnectRequired: wallet.setConnectRequired, supplies, updateReefiLockedMGP: locked.updateReefiMGP, updateTotalLockedMGP: locked.updateMGP, updateUnclaimedUserYield: rewards.updateUnclaimedUserYield, updateUnlockSchedule: withdraws.updateUnlockSchedule, updateUnsubmittedWithdraws: withdraws.updateUnsubmittedWithdraws, updateUserPendingWithdraws: withdraws.updateUserPendingWithdraws, updateUserWithdrawable: withdraws.updateUserWithdrawable, writeContracts })
  const withdrawMGP = useWithdrawMGP({ account: wallet.account, balances, chain: wallet.chain, clients: wallet.clients, setConnectRequired: wallet.setConnectRequired, updateUnsubmittedWithdraws: withdraws.updateUnsubmittedWithdraws, updateUserPendingWithdraws: withdraws.updateUserPendingWithdraws, updateUserWithdrawable: withdraws.updateUserWithdrawable, writeContracts })
  const compoundRMGP = useCompoundRMGP({ account: wallet.account, balances, chain: wallet.chain, clients: wallet.clients, setConnectRequired: wallet.setConnectRequired, supplies, updatePendingRewards: rewards.updatePendingRewards, updateReefiLockedMGP: locked.updateReefiMGP, updateTotalLockedMGP: locked.updateMGP, updateUnclaimedUserYield: rewards.updateUnclaimedUserYield, writeContracts })
  const claimYMGPRewards = useClaimYMGPRewards({ account: wallet.account, chain: wallet.chain, clients: wallet.clients, setConnectRequired: wallet.setConnectRequired, updateUnclaimedUserYield: rewards.updateUnclaimedUserYield, writeContracts })
  const supplyLiquidity = useSupplyLiquidity({ account: wallet.account, balances, chain: wallet.chain, clients: wallet.clients, mgpLPAmount: amounts.mgpLP, rmgpLPAmount: amounts.rmgpLP, setConnectRequired: wallet.setConnectRequired, writeContracts, ymgpLPAmount: amounts.ymgpLP })
  const swap = useSwap({ account: wallet.account, allowances, chain: wallet.chain, clients: wallet.clients, sendAmount: amounts.send, setConnectRequired: wallet.setConnectRequired, setError, setNotification })
  const mintWETH = useMintWETH({ account: wallet.account, allowances, chain: wallet.chain, clients: wallet.clients, sendAmount: amounts.send, setConnectRequired: wallet.setConnectRequired, setError, writeContracts })

  return { approve, depositMGP, buyRMGP, buyYMGP, buyMGP, sellYMGP, depositRMGP, lockYMGP, unlockYMGP, redeemRMGP, withdrawMGP, convertMGP, compoundRMGP, claimYMGPRewards, supplyLiquidity, swap, mintWETH }
}