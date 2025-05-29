import { useUpdateable } from './useUpdateable'
import { contracts } from '../config/contracts'
import { UseWallet } from './useWallet'

export interface UseBalances {
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

export const useBalances = ({ wallet }: { readonly wallet: UseWallet }): UseBalances => {
  const [mgp, updateMGP] = useUpdateable(() => wallet.account === undefined ? 0n : contracts[wallet.chain].MGP.read.balanceOf([wallet.account]), [contracts, wallet.account], 'mgp balance', 0n)
  const [rmgp, updateRMGP] = useUpdateable(() => wallet.account === undefined ? 0n : contracts[wallet.chain].RMGP.read.balanceOf([wallet.account]), [contracts, wallet.account], 'rmgp balance', 0n)
  const [ymgp, updateYMGP] = useUpdateable(() => wallet.account === undefined ? 0n : contracts[wallet.chain].YMGP.read.balanceOf([wallet.account]), [contracts, wallet.account], 'ymgp balance', 0n)
  // const [vmgp, updateVMGP] = useUpdateable(() => wallet.account === undefined ? 0n : contracts[wallet.chain].VMGP.read.balanceOf([wallet.account]), [contracts, wallet.account], 'vmgp balance', 0n)
  const [cmgp, updateCMGP] = useUpdateable(() => wallet.account === undefined ? 0n : contracts[wallet.chain].CMGP.read.balanceOf([wallet.account]), [contracts, wallet.account], 'cmgp balance', 0n)
  const [mgpCurve, updateMGPCurve] = useUpdateable(() => contracts[wallet.chain].MGP.read.balanceOf([contracts[wallet.chain].CMGP.address]), [contracts, wallet.chain, wallet.account], 'mgpCurve balance', 0n)
  const [rmgpCurve, updateRMGPCurve] = useUpdateable(() => contracts[wallet.chain].RMGP.read.balanceOf([contracts[wallet.chain].CMGP.address]), [contracts, wallet.chain, wallet.account], 'rmgpCurve balance', 0n)
  const [ymgpCurve, updateYMGPCurve] = useUpdateable(() => contracts[wallet.chain].YMGP.read.balanceOf([contracts[wallet.chain].CMGP.address]), [contracts, wallet.chain, wallet.account], 'ymgpCurve balance', 0n)
  const [ymgpHoldings, updateYMGPHoldings] = useUpdateable(() => contracts[wallet.chain].RMGP.read.balanceOf([contracts[wallet.chain].YMGP.address]), [contracts, wallet.chain, wallet.account], 'ymgpHoldings balance', 0n)

  return { mgp, rmgp, ymgp, cmgp, mgpCurve, rmgpCurve, ymgpCurve, ymgpHoldings, updateMGP, updateRMGP, updateYMGP, updateCMGP, updateMGPCurve, updateRMGPCurve, updateYMGPCurve, updateYMGPHoldings }
}
