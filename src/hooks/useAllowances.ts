import { useUpdateable } from './useUpdateable'
import { Chains, contracts } from '../config/contracts'

export interface Allowances {
  readonly mgp: bigint
  readonly rmgp: bigint
  // readonly ymgp: bigint
  readonly mgpCurve: bigint
  readonly rmgpCurve: bigint
  readonly ymgpCurve: bigint
  readonly updateMGP: () => void
  readonly updateRMGP: () => void
  // readonly updateYMGP: () => void
  readonly updateMGPCurve: () => void
  readonly updateRMGPCurve: () => void
  readonly updateYMGPCurve: () => void
}

export const useAllowances = ({ account, chain }: { readonly account: `0x${string}` | undefined, readonly chain: Chains }): Allowances => {
  const [mgp, updateMGP] = useUpdateable(() => account !== undefined ? contracts[chain].MGP.read.allowance([account, contracts[chain].RMGP.address]) : 0n, [contracts, chain, account], 0n)
  const [rmgp, updateRMGP] = useUpdateable(() => account !== undefined ? contracts[chain].RMGP.read.allowance([account, contracts[chain].YMGP.address]) : 0n, [contracts, chain, account], 0n)
  // const [ymgp, updateYMGP] = useUpdateable(() => account !== undefined ? contracts[chain].YMGP.read.allowance([account, contracts[chain].VMGP.address]) : 0n, [contracts, chain, account], 0n)
  const [mgpCurve, updateMGPCurve] = useUpdateable(() => account !== undefined ? contracts[chain].MGP.read.allowance([account, contracts[chain].CMGP.address]) : 0n, [contracts, chain, account], 0n)
  const [rmgpCurve, updateRMGPCurve] = useUpdateable(() => account !== undefined ? contracts[chain].RMGP.read.allowance([account, contracts[chain].CMGP.address]) : 0n, [contracts, chain, account], 0n)
  const [ymgpCurve, updateYMGPCurve] = useUpdateable(() => account !== undefined ? contracts[chain].YMGP.read.allowance([account, contracts[chain].CMGP.address]) : 0n, [contracts, account], 0n)

  return { mgp, rmgp, mgpCurve, rmgpCurve, ymgpCurve, updateMGP, updateRMGP, updateMGPCurve, updateRMGPCurve, updateYMGPCurve }
}