import { WalletClient, PublicActions } from "viem"
import type { Pages } from "../App"
import { Chains, contracts } from "../config/contracts"
import { useAllowances } from "./useAllowances"
import { useBalances } from "./useBalances"
import { useContracts } from "./useContracts"
import { useSupplies } from "./useSupplies"

interface Props {
  page: Pages,
  sendAmount: bigint,
  setConnectRequired: (state: boolean) => void
  setError: (msg: string) => void
  mgpLPAmount: bigint
  rmgpLPAmount: bigint
  ymgpLPAmount: bigint
  updateUserPendingWithdraws: () => void
  updateUnsubmittedWithdraws: () => void
  updateUserWithdrawable: () => void
  updateUnlockSchedule: () => void
  updatePendingRewards: () => void
  updateUnclaimedUserYield: () => void
  updateTotalLockedMGP: () => void
  updateReefiLockedMGP: () => void
  updateTotalLockedYMGP: () => void
  updateUserLockedYMGP: () => void
  updateYMGPHoldings: () => void
  clients: Record<Chains, WalletClient & PublicActions> | undefined
  account: `0x${string}`
  chain: Chains
}

export const useActions = ({ page, sendAmount, setConnectRequired, setError, mgpLPAmount, rmgpLPAmount, ymgpLPAmount, updateUserPendingWithdraws, updateUnsubmittedWithdraws, updateUserWithdrawable, updateUnlockSchedule, updatePendingRewards, updateUnclaimedUserYield, updateTotalLockedMGP, updateReefiLockedMGP, updateTotalLockedYMGP, updateUserLockedYMGP, updateYMGPHoldings, clients, account, chain }: Props) => {
  const balances = useBalances({ account, chain })
  const supplies = useSupplies({ chain })
  const allowances = useAllowances({ account, chain })
  const { write: writeContracts } = useContracts({ clients })

  const approve = async (infinity = false, curve = false): Promise<void> => {
    if (!clients || !writeContracts) return setConnectRequired(true)
    if (!account) return setConnectRequired(true)
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
    if (!clients || !writeContracts) return setConnectRequired(true)
    if (allowances.mgp === undefined || allowances.mgp < sendAmount) return setError('Allowance too low')
    await writeContracts[chain].RMGP.write.deposit([sendAmount], { account, chain: clients[chain].chain })
    balances.updateMGP()
    balances.updateRMGP()
    supplies.updateMGP()
    supplies.updateRMGP()
    updateTotalLockedMGP()
    updateReefiLockedMGP()
  }

  const buyRMGP = async (): Promise<void> => {
    if (!clients || !writeContracts) return setConnectRequired(true)
    if (allowances.mgpCurve === undefined || allowances.mgpCurve < sendAmount) return setError('Allowance too low')
    await writeContracts[chain].CMGP.write.exchange([0n, 1n, sendAmount, 0n], { account, chain: clients[chain].chain })
    balances.updateMGP()
    balances.updateRMGP()
    balances.updateMGPCurve()
    balances.updateRMGPCurve()
  }

  const buyYMGP = async (): Promise<void> => {
    if (!clients || !writeContracts) return setConnectRequired(true)
    if (allowances.rmgpCurve === undefined || allowances.rmgpCurve < sendAmount) return setError('Allowance too low')
    await writeContracts[chain].CMGP.write.exchange([1n, 2n, sendAmount, 0n], { account, chain: clients[chain].chain })
    balances.updateRMGP()
    balances.updateYMGP()
    balances.updateRMGPCurve()
    balances.updateYMGPCurve()
  }

  const buyMGP = async (): Promise<void> => {
    if (!clients || !writeContracts) return setConnectRequired(true)
    if (allowances.rmgpCurve === undefined || allowances.rmgpCurve < sendAmount) return setError('Allowance too low')
    await writeContracts[chain].CMGP.write.exchange([1n, 0n, sendAmount, 0n], { account, chain: clients[chain].chain })
    balances.updateMGP()
    balances.updateRMGP()
    balances.updateMGPCurve()
    balances.updateRMGPCurve()
  }

  const depositRMGP = async (): Promise<void> => {
    if (!clients || !writeContracts) return setConnectRequired(true)
    if (allowances.rmgp === undefined || allowances.rmgp < sendAmount) return setError('Allowance too low')
    await writeContracts[chain].YMGP.write.deposit([sendAmount], { account, chain: clients[chain].chain })
    balances.updateRMGP()
    balances.updateYMGP()
    supplies.updateRMGP()
    supplies.updateYMGP()
    updateYMGPHoldings()
  }

  const lockYMGP = async (): Promise<void> => {
    if (!clients || !writeContracts) return setConnectRequired(true)
    await writeContracts[chain].YMGP.write.lock([sendAmount], { account, chain: clients[chain].chain })
    supplies.updateYMGP()
    updateTotalLockedYMGP()
    updateUserLockedYMGP()
  }

  const unlockYMGP = async (): Promise<void> => {
    if (!clients || !writeContracts) return setConnectRequired(true)
    await writeContracts[chain].YMGP.write.unlock([sendAmount], { account, chain: clients[chain].chain })
    supplies.updateYMGP()
    updateTotalLockedYMGP()
    updateUserLockedYMGP()
  }

  const redeemRMGP = async (): Promise<void> => {
    if (!clients || !writeContracts) return setConnectRequired(true)
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
    if (!clients || !writeContracts) return setConnectRequired(true)
    await writeContracts[chain].RMGP.write.unlock({ account, chain: clients[chain].chain })
    await writeContracts[chain].RMGP.write.withdraw({ account, chain: clients[chain].chain })
    balances.updateMGP()
    updateUserPendingWithdraws()
    updateUnsubmittedWithdraws()
    updateUserWithdrawable()
  }

  const compoundRMGP = async (): Promise<void> => {
    if (!clients || !writeContracts || !account) return setConnectRequired(true)
    await writeContracts[chain].RMGP.write.claim({ account, chain: clients[chain].chain })
    updatePendingRewards()
    updateUnclaimedUserYield()
    supplies.updateRMGP()
    balances.updateRMGP()
    updateTotalLockedMGP()
    updateReefiLockedMGP()
  }

  const claimYMGPRewards = async (): Promise<void> => {
    if (!clients || !writeContracts) return setConnectRequired(true)
    await writeContracts[chain].YMGP.write.claim({ account, chain: clients[chain].chain })
    updateUnclaimedUserYield()
  }

  const supplyLiquidity = async (): Promise<void> => {
    if (!clients || !writeContracts || !account) return setConnectRequired(true)
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