import { useUpdateable } from './useUpdateable'
import { contracts, Chains } from '../config/contracts';

export const useSupplies = ({ chain }: { chain: Chains }) => {
  const [mgp, updateMGP] = useUpdateable(() => contracts[56].MGP.read.totalSupply(), [contracts])
  const [rmgp, updateRMGP] = useUpdateable(() => contracts[chain].RMGP.read.totalSupply(), [contracts, chain])
  const [ymgp, updateYMGP] = useUpdateable(() => contracts[chain].YMGP.read.totalSupply(), [contracts, chain])
  const [vmgp, updateVMGP] = useUpdateable(() => contracts[chain].VMGP.read.totalSupply(), [contracts, chain])

  return { mgp, updateMGP, rmgp, updateRMGP, ymgp, updateYMGP, vmgp, updateVMGP }
}