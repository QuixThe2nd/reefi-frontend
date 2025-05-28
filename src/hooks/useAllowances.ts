import { useUpdateable } from './useUpdateable'
import { Chains, contracts } from '../config/contracts'

export const useAllowances = ({ account, chain }: { account: `0x${string}`, chain: Chains }) => {
  const [mgp, updateMGP] = useUpdateable(() => contracts[chain].MGP.read.allowance([account, contracts[chain].RMGP.address]), [contracts, chain, account])
  const [rmgp, updateRMGP] = useUpdateable(() => contracts[chain].RMGP.read.allowance([account, contracts[chain].YMGP.address]), [contracts, chain, account])
  const [ymgp, updateYMGP] = useUpdateable(() => contracts[chain].YMGP.read.allowance([account, contracts[chain].VMGP.address]), [contracts, chain, account])
  const [mgpCurve, updateMGPCurve] = useUpdateable(() => contracts[chain].MGP.read.allowance([account, contracts[chain].CMGP.address]), [contracts, chain, account])
  const [rmgpCurve, updateRMGPCurve] = useUpdateable(() => contracts[chain].RMGP.read.allowance([account, contracts[chain].CMGP.address]), [contracts, chain, account])
  const [ymgpCurve, updateYMGPCurve] = useUpdateable(() => contracts[chain].YMGP.read.allowance([account, contracts[chain].CMGP.address]), [contracts, account])

  return { mgp, rmgp, ymgp, mgpCurve, rmgpCurve, ymgpCurve, updateMGP, updateRMGP, updateYMGP, updateMGPCurve, updateRMGPCurve, updateYMGPCurve }
}