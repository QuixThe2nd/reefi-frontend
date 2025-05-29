import { useUpdateable } from './useUpdateable'
import { contracts } from '../config/contracts'
import { UseWallet } from './useWallet'

export interface UseAllowances {
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

export const useAllowances = ({ wallet }: { readonly wallet: UseWallet }): UseAllowances => {
  const [mgp, updateMGP] = useUpdateable(() => wallet.account === undefined ? 0n : contracts[wallet.chain].MGP.read.allowance([wallet.account, contracts[wallet.chain].RMGP.address]), [contracts, wallet.chain, wallet.account], 'mgp allowance', 0n)
  const [rmgp, updateRMGP] = useUpdateable(() => wallet.account === undefined ? 0n : contracts[wallet.chain].RMGP.read.allowance([wallet.account, contracts[wallet.chain].YMGP.address]), [contracts, wallet.chain, wallet.account], 'rmgp allowance', 0n)
  // const [ymgp, updateYMGP] = useUpdateable(() => wallet.account === undefined ? 0n : contracts[wallet.chain].YMGP.read.allowance([wallet.account, contracts[wallet.chain].VMGP.address]), [contracts, wallet.chain, wallet.account], 'ymgp allowance', 0n)
  const [mgpCurve, updateMGPCurve] = useUpdateable(() => wallet.account === undefined ? 0n : contracts[wallet.chain].MGP.read.allowance([wallet.account, contracts[wallet.chain].CMGP.address]), [contracts, wallet.chain, wallet.account], 'mgpCurve allowance', 0n)
  const [rmgpCurve, updateRMGPCurve] = useUpdateable(() => wallet.account === undefined ? 0n : contracts[wallet.chain].RMGP.read.allowance([wallet.account, contracts[wallet.chain].CMGP.address]), [contracts, wallet.chain, wallet.account], 'rmgpCurve allowance', 0n)
  const [ymgpCurve, updateYMGPCurve] = useUpdateable(() => wallet.account === undefined ? 0n : contracts[wallet.chain].YMGP.read.allowance([wallet.account, contracts[wallet.chain].CMGP.address]), [contracts, wallet.account], 'ymgpCurve allowance', 0n)

  return { mgp, rmgp, mgpCurve, rmgpCurve, ymgpCurve, updateMGP, updateRMGP, updateMGPCurve, updateRMGPCurve, updateYMGPCurve }
}