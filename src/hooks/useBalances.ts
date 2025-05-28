import { useUpdateable } from './useUpdateable'
import { Chains, contracts } from '../config/contracts'

export const useBalances = ({ account, chain }: { account: `0x${string}`, chain: Chains }) => {
  const [mgp, updateMGP] = useUpdateable(() => contracts[chain].MGP.read.balanceOf([account]), [contracts, account])
  const [rmgp, updateRMGP] = useUpdateable(() => contracts[chain].RMGP.read.balanceOf([account]), [contracts, account])
  const [ymgp, updateYMGP] = useUpdateable(() => contracts[chain].YMGP.read.balanceOf([account]), [contracts, account])
  const [vmgp, updateVMGP] = useUpdateable(() => contracts[chain].VMGP.read.balanceOf([account]), [contracts, account])
  const [cmgp, updateCMGP] = useUpdateable(() => contracts[chain].CMGP.read.balanceOf([account]), [contracts, account])
  const [mgpCurve, updateMGPCurve] = useUpdateable(() => contracts[chain].MGP.read.balanceOf([contracts[chain].CMGP.address]), [contracts, chain, account])
  const [rmgpCurve, updateRMGPCurve] = useUpdateable(() => contracts[chain].RMGP.read.balanceOf([contracts[chain].CMGP.address]), [contracts, chain, account])
  const [ymgpCurve, updateYMGPCurve] = useUpdateable(() => contracts[chain].YMGP.read.balanceOf([contracts[chain].CMGP.address]), [contracts, chain, account])
  const [ymgpHoldings, updateYMGPHoldings] = useUpdateable(() => contracts[chain].RMGP.read.balanceOf([contracts[chain].YMGP.address]), [contracts, chain, account])

  return { mgp, rmgp, ymgp, vmgp, cmgp, updateMGP, updateRMGP, updateYMGP, updateVMGP, updateCMGP, mgpCurve, updateMGPCurve, rmgpCurve, updateRMGPCurve, ymgpCurve, updateYMGPCurve, ymgpHoldings, updateYMGPHoldings }
}