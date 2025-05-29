import { useMemo } from "react"
import { contracts } from "../config/contracts"
import { useUpdateable } from "./useUpdateable"
import type { UseWallet } from './useWallet';

export interface UseLocked {
  readonly reefiMGP: bigint
  readonly ymgp: bigint
  readonly userYMGP: bigint
  readonly mgp: bigint
  readonly updateReefiMGP: () => void
  readonly updateYMGP: () => void
  readonly updateUserYMGP: () => void
  readonly updateMGP: () => void
}

export const useLocked = ({ wallet }: { readonly wallet: UseWallet }): UseLocked => {
  const [reefiMGP, updateReefiMGP] = useUpdateable(() => contracts[wallet.chain].VLMGP.read.getUserTotalLocked([contracts[wallet.chain].RMGP.address]), [contracts, wallet.account, wallet.chain], 'reefiMGP locked', 0n)
  const [mgpBSC, updateMGPBSC] = useUpdateable(() => contracts[56].VLMGP.read.totalLocked(), [contracts, wallet.account], 'mgpBSC locked', 0n)
  const [mgpARB, updateMGPARB] = useUpdateable(() => contracts[42_161].VLMGP.read.totalLocked(), [contracts, wallet.account], 'mgpARB locked', 0n)
  const mgp = useMemo(() => mgpBSC + mgpARB, [mgpBSC, mgpARB])
  const updateMGP = (): void => {
    updateMGPBSC()
    updateMGPARB()
  }
  const [ymgp, updateYMGP] = useUpdateable(() => contracts[wallet.chain].YMGP.read.totalLocked(), [contracts, wallet.account], 'ymgp locked', 0n)
  const [userYMGP, updateUserYMGP] = useUpdateable(() => wallet.account === undefined ? 0n : contracts[wallet.chain].YMGP.read.lockedBalances([wallet.account]), [contracts, wallet.account], 'userYMGP locked', 0n)

  return { reefiMGP, ymgp, userYMGP, mgp, updateReefiMGP, updateYMGP, updateUserYMGP, updateMGP }
}
