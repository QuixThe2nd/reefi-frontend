import { Chains, contracts } from "../config/contracts"
import { useUpdateable } from "./useUpdateable"

interface Withdraws {
  userPendingWithdraws: bigint
  updateUserPendingWithdraws: () => void
  unsubmittedWithdraws: bigint
  updateUnsubmittedWithdraws: () => void
  userWithdrawable: bigint
  updateUserWithdrawable: () => void
  unlockSchedule: readonly { startTime: bigint; endTime: bigint; amountInCoolDown: bigint; }[]
  updateUnlockSchedule: () => void
}

export const useWithdraws = ({ account, chain }: { readonly account: `0x${string}` | undefined, readonly chain: Chains }): Withdraws => {
  const [userPendingWithdraws, updateUserPendingWithdraws] = useUpdateable(() => account === undefined ? 0n : contracts[chain].RMGP.read.getUserPendingWithdraws([account]), [contracts, account, chain], 'userPendingWithdraws', 0n)
  const [unsubmittedWithdraws, updateUnsubmittedWithdraws] = useUpdateable(() => contracts[chain].RMGP.read.unsubmittedWithdraws(), [contracts, chain], 'unsubmittedWithdraws', 0n)
  const [userWithdrawable, updateUserWithdrawable] = useUpdateable(() => contracts[chain].RMGP.read.getUserWithdrawable(), [contracts, chain], 'userWithdrawable', 0n)
  const [unlockSchedule, updateUnlockSchedule] = useUpdateable(() => contracts[chain].VLMGP.read.getUserUnlockingSchedule([contracts[chain].RMGP.address]), [contracts, chain], 'unlockSchedule', [])

  return { userPendingWithdraws, updateUserPendingWithdraws, unsubmittedWithdraws, updateUnsubmittedWithdraws, userWithdrawable, updateUserWithdrawable, unlockSchedule, updateUnlockSchedule }
}