import { useUpdateable } from './useUpdateable'
import { Coins, contracts } from '../config/contracts'
import { UseWallet } from './useWallet'

export type UseBalances = Record<Coins, [bigint, () => void]> & {
  readonly mgpCurve: bigint
  readonly rmgpCurve: bigint
  readonly ymgpCurve: bigint
  readonly ymgpHoldings: bigint
  readonly updateMGPCurve: () => void
  readonly updateRMGPCurve: () => void
  readonly updateYMGPCurve: () => void
  readonly updateYMGPHoldings: () => void
}

export const useBalances = ({ wallet }: { readonly wallet: UseWallet }): UseBalances => {
  const MGP = useUpdateable(() => wallet.account === undefined ? 0n : contracts[wallet.chain].MGP.read.balanceOf([wallet.account]), [contracts, wallet.account], 'mgp balance', 0n)
  const RMGP = useUpdateable(() => wallet.account === undefined ? 0n : contracts[wallet.chain].RMGP.read.balanceOf([wallet.account]), [contracts, wallet.account], 'rmgp balance', 0n)
  const YMGP = useUpdateable(() => wallet.account === undefined ? 0n : contracts[wallet.chain].YMGP.read.balanceOf([wallet.account]), [contracts, wallet.account], 'ymgp balance', 0n)
  const CMGP = useUpdateable(() => wallet.account === undefined ? 0n : contracts[wallet.chain].CMGP.read.balanceOf([wallet.account]), [contracts, wallet.account], 'cmgp balance', 0n)
  const CKP = useUpdateable(() => wallet.account === undefined ? 0n : contracts[wallet.chain].CKP.read.balanceOf([wallet.account]), [contracts, wallet.account], 'CKP balance', 0n)
  const PNP = useUpdateable(() => wallet.account === undefined ? 0n : contracts[wallet.chain].PNP.read.balanceOf([wallet.account]), [contracts, wallet.account], 'PNP balance', 0n)
  const EGP = useUpdateable(() => wallet.account === undefined ? 0n : contracts[wallet.chain].EGP.read.balanceOf([wallet.account]), [contracts, wallet.account], 'EGP balance', 0n)
  const LTP = useUpdateable(() => wallet.account === undefined ? 0n : contracts[wallet.chain].LTP.read.balanceOf([wallet.account]), [contracts, wallet.account], 'LTP balance', 0n)
  const ETH = useUpdateable(() => wallet.account === undefined ? 0n : contracts[wallet.chain].ETH.read.balanceOf([wallet.account]), [contracts, wallet.account], 'ETH balance', 0n)
  const BNB = useUpdateable(() => wallet.account === undefined ? 0n : contracts[wallet.chain].BNB.read.balanceOf([wallet.account]), [contracts, wallet.account], 'BNB balance', 0n)
  const [mgpCurve, updateMGPCurve] = useUpdateable(() => contracts[wallet.chain].MGP.read.balanceOf([contracts[wallet.chain].CMGP.address]), [contracts, wallet.chain, wallet.account], 'mgpCurve balance', 0n)
  const [rmgpCurve, updateRMGPCurve] = useUpdateable(() => contracts[wallet.chain].RMGP.read.balanceOf([contracts[wallet.chain].CMGP.address]), [contracts, wallet.chain, wallet.account], 'rmgpCurve balance', 0n)
  const [ymgpCurve, updateYMGPCurve] = useUpdateable(() => contracts[wallet.chain].YMGP.read.balanceOf([contracts[wallet.chain].CMGP.address]), [contracts, wallet.chain, wallet.account], 'ymgpCurve balance', 0n)
  const [ymgpHoldings, updateYMGPHoldings] = useUpdateable(() => contracts[wallet.chain].RMGP.read.balanceOf([contracts[wallet.chain].YMGP.address]), [contracts, wallet.chain, wallet.account], 'ymgpHoldings balance', 0n)

  return { MGP, RMGP, YMGP, CMGP, CKP, PNP, EGP, LTP, ETH, BNB, mgpCurve, rmgpCurve, ymgpCurve, ymgpHoldings, updateMGPCurve, updateRMGPCurve, updateYMGPCurve, updateYMGPHoldings }
}
