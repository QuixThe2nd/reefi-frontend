import { useUpdateable } from './useUpdateable'
import { Chains, contracts } from '../config/contracts'

export interface Balances {
  readonly mgp: bigint
  readonly rmgp: bigint
  readonly ymgp: bigint
  // readonly vmgp: bigint
  readonly cmgp: bigint
  readonly mgpCurve: bigint
  readonly rmgpCurve: bigint
  readonly ymgpCurve: bigint
  readonly ymgpHoldings: bigint
  readonly updateMGP: () => void
  readonly updateRMGP: () => void
  readonly updateYMGP: () => void
  // readonly updateVMGP: () => void
  readonly updateCMGP: () => void
  readonly updateMGPCurve: () => void
  readonly updateRMGPCurve: () => void
  readonly updateYMGPCurve: () => void
  readonly updateYMGPHoldings: () => void
}

export const useBalances = ({ account, chain }: { readonly account: `0x${string}` | undefined, readonly chain: Chains }): Balances => {
  const [mgp, updateMGP] = useUpdateable(() => account === undefined ? 0n : contracts[chain].MGP.read.balanceOf([account]), [contracts, account], 'mgp balance', 0n)
  const [rmgp, updateRMGP] = useUpdateable(() => account === undefined ? 0n : contracts[chain].RMGP.read.balanceOf([account]), [contracts, account], 'rmgp balance', 0n)
  const [ymgp, updateYMGP] = useUpdateable(() => account === undefined ? 0n : contracts[chain].YMGP.read.balanceOf([account]), [contracts, account], 'ymgp balance', 0n)
  // const [vmgp, updateVMGP] = useUpdateable(() => account === undefined ? 0n : contracts[chain].VMGP.read.balanceOf([account]), [contracts, account], 'vmgp balance', 0n)
  const [cmgp, updateCMGP] = useUpdateable(() => account === undefined ? 0n : contracts[chain].CMGP.read.balanceOf([account]), [contracts, account], 'cmgp balance', 0n)
  const [mgpCurve, updateMGPCurve] = useUpdateable(() => contracts[chain].MGP.read.balanceOf([contracts[chain].CMGP.address]), [contracts, chain, account], 'mgpCurve balance', 0n)
  const [rmgpCurve, updateRMGPCurve] = useUpdateable(() => contracts[chain].RMGP.read.balanceOf([contracts[chain].CMGP.address]), [contracts, chain, account], 'rmgpCurve balance', 0n)
  const [ymgpCurve, updateYMGPCurve] = useUpdateable(() => contracts[chain].YMGP.read.balanceOf([contracts[chain].CMGP.address]), [contracts, chain, account], 'ymgpCurve balance', 0n)
  const [ymgpHoldings, updateYMGPHoldings] = useUpdateable(() => contracts[chain].RMGP.read.balanceOf([contracts[chain].YMGP.address]), [contracts, chain, account], 'ymgpHoldings balance', 0n)

  return { mgp, rmgp, ymgp, cmgp, mgpCurve, rmgpCurve, ymgpCurve, ymgpHoldings, updateMGP, updateRMGP, updateYMGP, updateCMGP, updateMGPCurve, updateRMGPCurve, updateYMGPCurve, updateYMGPHoldings }
}
