import { useMemo } from "react"
import { Chains, contracts } from "../config/contracts"
import { useUpdateable } from "./useUpdateable"

interface Locked {
  readonly reefiMGP: bigint
  readonly ymgp: bigint
  readonly userYMGP: bigint
  readonly mgp: bigint
  readonly updateReefiMGP: () => void
  readonly updateYMGP: () => void
  readonly updateUserYMGP: () => void
  readonly updateMGP: () => void
}

export const useLocked = ({ chain, account }: { readonly chain: Chains, readonly account: `0x${string}` | undefined }): Locked => {
  const [reefiMGP, updateReefiMGP] = useUpdateable(() => contracts[chain].VLMGP.read.getUserTotalLocked([contracts[chain].RMGP.address]), [contracts, account, chain], 0n)
  const [mgpBSC, updateMGPBSC] = useUpdateable(() => contracts[56].VLMGP.read.totalLocked(), [contracts, account], 0n)
  const [mgpARB, updateMGPARB] = useUpdateable(() => contracts[42_161].VLMGP.read.totalLocked(), [contracts, account], 0n)
  const mgp = useMemo(() => mgpBSC + mgpARB, [mgpBSC, mgpARB])
  const updateMGP = (): void => {
    updateMGPBSC()
    updateMGPARB()
  }
  const [ymgp, updateYMGP] = useUpdateable(() => contracts[chain].YMGP.read.totalLocked(), [contracts, account], 0n)
  const [userYMGP, updateUserYMGP] = useUpdateable(() => account === undefined ? 0n : contracts[chain].YMGP.read.lockedBalances([account]), [contracts, account], 0n)

  return { reefiMGP, ymgp, userYMGP, mgp, updateReefiMGP, updateYMGP, updateUserYMGP, updateMGP }
}
