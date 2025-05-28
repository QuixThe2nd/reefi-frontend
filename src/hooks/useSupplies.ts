import { useUpdateable } from './useUpdateable'
import { contracts, Chains } from '../config/contracts';

export interface Supplies {
  readonly mgp: bigint
  readonly rmgp: bigint
  readonly ymgp: bigint
  // readonly vmgp: bigint
  readonly updateMGP: () => void
  readonly updateRMGP: () => void
  readonly updateYMGP: () => void
  // readonly updateVMGP: () => void
}

export const useSupplies = ({ chain }: { readonly chain: Chains }): Supplies => {
  const [mgp, updateMGP] = useUpdateable(() => contracts[56].MGP.read.totalSupply(), [contracts], 0n)
  const [rmgp, updateRMGP] = useUpdateable(() => contracts[chain].RMGP.read.totalSupply(), [contracts, chain], 0n)
  const [ymgp, updateYMGP] = useUpdateable(() => contracts[chain].YMGP.read.totalSupply(), [contracts, chain], 0n)
  // const [vmgp, updateVMGP] = useUpdateable(() => contracts[chain].VMGP.read.totalSupply(), [contracts, chain], 0n)

  return { mgp, rmgp, ymgp, updateMGP, updateRMGP, updateYMGP }
}