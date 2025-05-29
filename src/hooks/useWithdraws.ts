import { contracts } from "../config/contracts"
import { useUpdateable } from "./useUpdateable"
import { UseWallet } from "./useWallet"

export interface UseWithdraws {
  userPendingWithdraws: bigint
  updateUserPendingWithdraws: () => void
  unsubmittedWithdraws: bigint
  updateUnsubmittedWithdraws: () => void
  userWithdrawable: bigint
  updateUserWithdrawable: () => void
  unlockSchedule: readonly { startTime: bigint; endTime: bigint; amountInCoolDown: bigint; }[]
  updateUnlockSchedule: () => void
}

export const useWithdraws = ({ wallet }: { readonly wallet: UseWallet }): UseWithdraws => {
  const [userPendingWithdraws, updateUserPendingWithdraws] = useUpdateable(() => wallet.account === undefined ? 0n : contracts[wallet.chain].RMGP.read.getUserPendingWithdraws([wallet.account]), [contracts, wallet.account, wallet.chain], 'userPendingWithdraws', 0n)
  const [unsubmittedWithdraws, updateUnsubmittedWithdraws] = useUpdateable(() => contracts[wallet.chain].RMGP.read.unsubmittedWithdraws(), [contracts, wallet.chain], 'unsubmittedWithdraws', 0n)
  const [userWithdrawable, updateUserWithdrawable] = useUpdateable(() => contracts[wallet.chain].RMGP.read.getUserWithdrawable(), [contracts, wallet.chain], 'userWithdrawable', 0n)
  const [unlockSchedule, updateUnlockSchedule] = useUpdateable(() => contracts[wallet.chain].VLMGP.read.getUserUnlockingSchedule([contracts[wallet.chain].RMGP.address]), [contracts, wallet.chain], 'unlockSchedule', [])

  return { userPendingWithdraws, updateUserPendingWithdraws, unsubmittedWithdraws, updateUnsubmittedWithdraws, userWithdrawable, updateUserWithdrawable, unlockSchedule, updateUnlockSchedule }
}