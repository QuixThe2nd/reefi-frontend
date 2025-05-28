import { useMemo } from "react"
import { Chains, contracts } from "../config/contracts"
import { useUpdateable } from "./useUpdateable"

export const useLocked = ({ chain, account }: { chain: Chains, account: `0x${string}` }) => {
  const [reefiMGP, updateReefiMGP] = useUpdateable(() => contracts[chain].VLMGP.read.getUserTotalLocked([contracts[chain].RMGP.address]), [contracts, account, chain])
  const [mgpBSC, updateMGPBSC] = useUpdateable(() => contracts[56].VLMGP.read.totalLocked(), [contracts, account])
  const [mgpARB, updateMGPARB] = useUpdateable(() => contracts[42161].VLMGP.read.totalLocked(), [contracts, account])
  const mgp = useMemo(() => { return mgpBSC === undefined || mgpARB === undefined ? undefined : mgpBSC + mgpARB }, [mgpBSC, mgpARB])
  const updateMGP = (): void => {
    updateMGPBSC()
    updateMGPARB()
  }
  const [ymgp, updateYMGP] = useUpdateable(() => contracts[chain].YMGP.read.totalLocked(), [contracts, account])
  const [userYMGP, updateUserYMGP] = useUpdateable(() => contracts[chain].YMGP.read.lockedBalances([account]), [contracts, account])

  return { reefiMGP, updateReefiMGP, ymgp, updateYMGP, userYMGP, updateUserYMGP, mgp, updateMGP }
}
