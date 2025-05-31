import { useCachedUpdateable } from './useUpdateable'
import { contracts } from '../config/contracts';
import { UseWallet } from './useWallet';

export interface UseSupplies {
  readonly mgp: bigint
  readonly rmgp: bigint
  readonly ymgp: bigint
  // readonly vmgp: bigint
  readonly updateMGP: () => void
  readonly updateRMGP: () => void
  readonly updateYMGP: () => void
  // readonly updateVMGP: () => void
}

export const useSupplies = ({ wallet }: { readonly wallet: UseWallet }): UseSupplies => {
  const [mgp, updateMGP] = useCachedUpdateable(() => contracts[56].MGP.read.totalSupply(), [contracts], 'mgp supply', 0n)
  const [rmgp, updateRMGP] = useCachedUpdateable(() => contracts[wallet.chain].rMGP.read.totalSupply(), [contracts, wallet.chain], 'rmgp supply', 0n)
  const [ymgp, updateYMGP] = useCachedUpdateable(() => contracts[wallet.chain].yMGP.read.totalSupply(), [contracts, wallet.chain], 'ymgp supply', 0n)
  // const [vmgp, updateVMGP] = useCachedUpdateable(() => contracts[wallet.chain].VMGP.read.totalSupply(), [contracts, wallet.chain], 0n)

  return { mgp, rmgp, ymgp, updateMGP, updateRMGP, updateYMGP }
}