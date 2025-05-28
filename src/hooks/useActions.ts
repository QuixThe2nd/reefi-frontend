import { WalletClient, PublicActions } from "viem"
import type { Pages } from "../App"
import { Chains } from "../config/contracts"
import { Allowances } from "./useAllowances"
import { Balances } from "./useBalances"
import { Contracts } from "./useContracts"
import { Supplies } from "./useSupplies"
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

interface Props<Clients extends Record<Chains, WalletClient & PublicActions> | undefined> {
  readonly page: Pages,
  readonly sendAmount: bigint,
  readonly setConnectRequired: (_state: boolean) => void
  readonly setError: (_msg: string) => void
  readonly mgpLPAmount: bigint
  readonly rmgpLPAmount: bigint
  readonly ymgpLPAmount: bigint
  readonly updateUserPendingWithdraws: () => void
  readonly updateUnsubmittedWithdraws: () => void
  readonly updateUserWithdrawable: () => void
  readonly updateUnlockSchedule: () => void
  readonly updatePendingRewards: () => void
  readonly updateUnclaimedUserYield: () => void
  readonly updateTotalLockedMGP: () => void
  readonly updateReefiLockedMGP: () => void
  readonly updateTotalLockedYMGP: () => void
  readonly updateUserLockedYMGP: () => void
  readonly updateYMGPHoldings: () => void
  readonly account: `0x${string}` | undefined
  readonly chain: Chains
  readonly balances: Balances
  readonly supplies: Supplies
  readonly allowances: Allowances
  readonly clients: Clients
  readonly writeContracts: Contracts<Clients>
}

interface UseActions {
  approve: () => void
  depositMGP: () => void
  buyRMGP: () => void
  buyYMGP: () => void
  buyMGP: () => void
  depositRMGP: () => void
  lockYMGP: () => void
  unlockYMGP: () => void
  redeemRMGP: () => void
  withdrawMGP: () => void
  compoundRMGP: () => void
  claimYMGPRewards: () => void
  supplyLiquidity: () => void
}

export const useActions = <Clients extends Record<Chains, WalletClient & PublicActions> | undefined>({ page, sendAmount, setConnectRequired, setError, mgpLPAmount, rmgpLPAmount, ymgpLPAmount, updateUserPendingWithdraws, updateUnsubmittedWithdraws, updateUserWithdrawable, updateUnlockSchedule, updatePendingRewards, updateUnclaimedUserYield, updateTotalLockedMGP, updateReefiLockedMGP, updateTotalLockedYMGP, updateUserLockedYMGP, updateYMGPHoldings, clients, account, chain, balances, supplies, allowances, writeContracts }: Props<Clients>): UseActions => {
  const approve = useApprove({ account, allowances, chain, clients, page, sendAmount, setConnectRequired, writeContracts })
  const depositMGP = useDepositMGP({ account, allowances, balances, chain, clients, sendAmount, setConnectRequired, setError, supplies, updateReefiLockedMGP, updateTotalLockedMGP, writeContracts })
  const buyRMGP = useBuyRMGP({ account, allowances, balances, chain, clients, sendAmount, setConnectRequired, setError, writeContracts })
  const buyYMGP = useBuyYMGP({ account, allowances, balances, chain, clients, sendAmount, setConnectRequired, setError, writeContracts })
  const buyMGP = useBuyMGP({ account, allowances, balances, chain, clients, sendAmount, setConnectRequired, setError, writeContracts })
  const depositRMGP = useDepositRMGP({ account, allowances, balances, chain, clients, sendAmount, setConnectRequired, setError, supplies, updateYMGPHoldings, writeContracts })
  const lockYMGP = useLockYMGP({ account, chain, clients, sendAmount, setConnectRequired, supplies, updateTotalLockedYMGP, updateUserLockedYMGP, writeContracts })
  const unlockYMGP = useUnlockYMGP({ account, chain, clients, sendAmount, setConnectRequired, supplies, updateTotalLockedYMGP, updateUserLockedYMGP, writeContracts })
  const redeemRMGP = useRedeemRMGP({ account, balances, chain, clients, sendAmount, setConnectRequired, supplies, updateReefiLockedMGP, updateTotalLockedMGP, updateUnclaimedUserYield, updateUnlockSchedule, updateUnsubmittedWithdraws, updateUserPendingWithdraws, updateUserWithdrawable, writeContracts })
  const withdrawMGP = useWithdrawMGP({ account, balances, chain, clients, setConnectRequired, updateUnsubmittedWithdraws, updateUserPendingWithdraws, updateUserWithdrawable, writeContracts })
  const compoundRMGP = useCompoundRMGP({ account, balances, chain, clients, setConnectRequired, supplies, updatePendingRewards, updateReefiLockedMGP, updateTotalLockedMGP, updateUnclaimedUserYield, writeContracts })
  const claimYMGPRewards = useClaimYMGPRewards({ account, chain, clients, setConnectRequired, updateUnclaimedUserYield, writeContracts })
  const supplyLiquidity = useSupplyLiquidity({ account, balances, chain, clients, mgpLPAmount, rmgpLPAmount, setConnectRequired, writeContracts, ymgpLPAmount })

  return { approve, depositMGP, buyRMGP, buyYMGP, buyMGP, depositRMGP, lockYMGP, unlockYMGP, redeemRMGP, withdrawMGP, compoundRMGP, claimYMGPRewards, supplyLiquidity }
}