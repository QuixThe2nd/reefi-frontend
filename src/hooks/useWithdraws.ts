import { Chains, contracts } from "../config/contracts"
import { useUpdateable } from "./useUpdateable"

export const useWithdraws = ({ account, chain }: { account: `0x${string}`, chain: Chains }) => {
  const [userPendingWithdraws, updateUserPendingWithdraws] = useUpdateable(() => contracts[chain].RMGP.read.getUserPendingWithdraws([account]), [contracts, account, chain])
  const [unsubmittedWithdraws, updateUnsubmittedWithdraws] = useUpdateable(() => contracts[chain].RMGP.read.unsubmittedWithdraws(), [contracts, chain])
  const [userWithdrawable, updateUserWithdrawable] = useUpdateable(() => contracts[chain].RMGP.read.getUserWithdrawable(), [contracts, chain])
  const [unlockSchedule, updateUnlockSchedule] = useUpdateable(() => contracts[chain].VLMGP.read.getUserUnlockingSchedule([contracts[chain].RMGP.address]), [contracts, chain])

  return { userPendingWithdraws, updateUserPendingWithdraws, unsubmittedWithdraws, updateUnsubmittedWithdraws, userWithdrawable, updateUserWithdrawable, unlockSchedule, updateUnlockSchedule }
}