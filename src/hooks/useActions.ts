import { WalletClient, PublicActions } from "viem"
import type { Pages } from "../App"
import { Chains, contracts } from "../config/contracts"
import { Allowances } from "./useAllowances"
import { Balances } from "./useBalances"
import { Contracts } from "./useContracts"
import { Supplies } from "./useSupplies"

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
  approve: () => Promise<void>
  depositMGP: () => Promise<void>
  buyRMGP: () => Promise<void>
  buyYMGP: () => Promise<void>
  buyMGP: () => Promise<void>
  depositRMGP: () => Promise<void>
  lockYMGP: () => Promise<void>
  unlockYMGP: () => Promise<void>
  redeemRMGP: () => Promise<void>
  withdrawMGP: () => Promise<void>
  compoundRMGP: () => Promise<void>
  claimYMGPRewards: () => Promise<void>
  supplyLiquidity: () => Promise<void>
}

export const useActions = <Clients extends Record<Chains, WalletClient & PublicActions> | undefined>({ page, sendAmount, setConnectRequired, setError, mgpLPAmount, rmgpLPAmount, ymgpLPAmount, updateUserPendingWithdraws, updateUnsubmittedWithdraws, updateUserWithdrawable, updateUnlockSchedule, updatePendingRewards, updateUnclaimedUserYield, updateTotalLockedMGP, updateReefiLockedMGP, updateTotalLockedYMGP, updateUserLockedYMGP, updateYMGPHoldings, clients, account, chain, balances, supplies, allowances, writeContracts }: Props<Clients>): UseActions => {
  const approve = async (infinity = false, curve = false): Promise<void> => {
    if (clients === undefined || !writeContracts || account === undefined) return setConnectRequired(true)
    if (page === 'deposit') {
      const amount = infinity ? 2n ** 256n - 1n : sendAmount;
      await writeContracts[chain].MGP.write.approve([curve ? contracts[chain].CMGP.address : contracts[chain].RMGP.address, amount], { account, chain: clients[chain].chain })
      if (curve) allowances.updateMGPCurve()
      else allowances.updateMGP()
    } else if (page === 'convert' || page === 'redeem') {
      const amount = infinity ? 2n ** 256n - 1n : sendAmount;
      await writeContracts[chain].RMGP.write.approve([curve ? contracts[chain].CMGP.address : contracts[chain].YMGP.address, amount], { account, chain: clients[chain].chain })
      if (curve) allowances.updateRMGPCurve()
      else allowances.updateRMGP()
    }
  }

  const depositMGP = async (): Promise<void> => {
    if (!clients || !writeContracts || account === undefined) return setConnectRequired(true)
    if (allowances.mgp < sendAmount) return setError('Allowance too low')
    await writeContracts[chain].RMGP.write.deposit([sendAmount], { account, chain: clients[chain].chain })
    balances.updateMGP()
    balances.updateRMGP()
    supplies.updateMGP()
    supplies.updateRMGP()
    updateTotalLockedMGP()
    updateReefiLockedMGP()
  }

  const buyRMGP = async (): Promise<void> => {
    if (!clients || !writeContracts || account === undefined) return setConnectRequired(true)
    if (allowances.mgpCurve < sendAmount) return setError('Allowance too low')
    await writeContracts[chain].CMGP.write.exchange([0n, 1n, sendAmount, 0n], { account, chain: clients[chain].chain })
    balances.updateMGP()
    balances.updateRMGP()
    balances.updateMGPCurve()
    balances.updateRMGPCurve()
  }

  const buyYMGP = async (): Promise<void> => {
    if (!clients || !writeContracts || account === undefined) return setConnectRequired(true)
    if (allowances.rmgpCurve < sendAmount) return setError('Allowance too low')
    await writeContracts[chain].CMGP.write.exchange([1n, 2n, sendAmount, 0n], { account, chain: clients[chain].chain })
    balances.updateRMGP()
    balances.updateYMGP()
    balances.updateRMGPCurve()
    balances.updateYMGPCurve()
  }

  const buyMGP = async (): Promise<void> => {
    if (!clients || !writeContracts || account === undefined) return setConnectRequired(true)
    if (allowances.rmgpCurve < sendAmount) return setError('Allowance too low')
    await writeContracts[chain].CMGP.write.exchange([1n, 0n, sendAmount, 0n], { account, chain: clients[chain].chain })
    balances.updateMGP()
    balances.updateRMGP()
    balances.updateMGPCurve()
    balances.updateRMGPCurve()
  }

  const depositRMGP = async (): Promise<void> => {
    if (!clients || !writeContracts || account === undefined) return setConnectRequired(true)
    if (allowances.rmgp < sendAmount) return setError('Allowance too low')
    await writeContracts[chain].YMGP.write.deposit([sendAmount], { account, chain: clients[chain].chain })
    balances.updateRMGP()
    balances.updateYMGP()
    supplies.updateRMGP()
    supplies.updateYMGP()
    updateYMGPHoldings()
  }

  const lockYMGP = async (): Promise<void> => {
    if (!clients || !writeContracts || account === undefined) return setConnectRequired(true)
    await writeContracts[chain].YMGP.write.lock([sendAmount], { account, chain: clients[chain].chain })
    supplies.updateYMGP()
    updateTotalLockedYMGP()
    updateUserLockedYMGP()
  }

  const unlockYMGP = async (): Promise<void> => {
    if (!clients || !writeContracts || account === undefined) return setConnectRequired(true)
    await writeContracts[chain].YMGP.write.unlock([sendAmount], { account, chain: clients[chain].chain })
    supplies.updateYMGP()
    updateTotalLockedYMGP()
    updateUserLockedYMGP()
  }

  const redeemRMGP = async (): Promise<void> => {
    if (!clients || !writeContracts || account === undefined) return setConnectRequired(true)
    await writeContracts[chain].RMGP.write.startUnlock([sendAmount], { account, chain: clients[chain].chain })
    updateUnlockSchedule()
    supplies.updateRMGP()
    balances.updateRMGP()
    updateTotalLockedMGP()
    updateReefiLockedMGP()
    updateUserPendingWithdraws()
    updateUnsubmittedWithdraws()
    updateUserWithdrawable()
    updateUnclaimedUserYield()
  }

  const withdrawMGP = async (): Promise<void> => {
    if (!clients || !writeContracts || account === undefined) return setConnectRequired(true)
    await writeContracts[chain].RMGP.write.unlock({ account, chain: clients[chain].chain })
    await writeContracts[chain].RMGP.write.withdraw({ account, chain: clients[chain].chain })
    balances.updateMGP()
    updateUserPendingWithdraws()
    updateUnsubmittedWithdraws()
    updateUserWithdrawable()
  }

  const compoundRMGP = async (): Promise<void> => {
    if (!clients || !writeContracts || account === undefined) return setConnectRequired(true)
    await writeContracts[chain].RMGP.write.claim({ account, chain: clients[chain].chain })
    updatePendingRewards()
    updateUnclaimedUserYield()
    supplies.updateRMGP()
    balances.updateRMGP()
    updateTotalLockedMGP()
    updateReefiLockedMGP()
  }

  const claimYMGPRewards = async (): Promise<void> => {
    if (!clients || !writeContracts || account === undefined) return setConnectRequired(true)
    await writeContracts[chain].YMGP.write.claim({ account, chain: clients[chain].chain })
    updateUnclaimedUserYield()
  }

  const supplyLiquidity = async (): Promise<void> => {
    if (!clients || !writeContracts || account === undefined) return setConnectRequired(true)
    await writeContracts[chain].CMGP.write.add_liquidity([[mgpLPAmount, rmgpLPAmount, ymgpLPAmount], 0n], { account, chain: clients[chain].chain })
    balances.updateMGP()
    balances.updateRMGP()
    balances.updateYMGP()
    balances.updateCMGP()
    balances.updateMGPCurve()
    balances.updateRMGPCurve()
    balances.updateYMGPCurve()
  }

  return { approve, depositMGP, buyRMGP, buyYMGP, buyMGP, depositRMGP, lockYMGP, unlockYMGP, redeemRMGP, withdrawMGP, compoundRMGP, claimYMGPRewards, supplyLiquidity }
}