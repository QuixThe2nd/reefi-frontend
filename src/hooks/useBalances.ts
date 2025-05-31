import { useCachedUpdateable } from './useUpdateable'
import { Coins, contracts, publicClients } from '../config/contracts'
import { UseWallet } from './useWallet'

export type UseBalances = Record<Coins, [bigint, () => void]> & {
  readonly mgpCurve: bigint
  readonly rmgpCurve: bigint
  readonly ymgpCurve: bigint
  readonly ymgpHoldings: bigint
  readonly ETH: [bigint, () => void]
  readonly updateMGPCurve: () => void
  readonly updateRMGPCurve: () => void
  readonly updateYMGPCurve: () => void
  readonly updateYMGPHoldings: () => void
}

export const useBalances = ({ wallet }: { readonly wallet: UseWallet }): UseBalances => {
  const MGP = useCachedUpdateable(() => wallet.account === undefined ? 0n : contracts[wallet.chain].MGP.read.balanceOf([wallet.account]), [contracts, wallet.account], 'mgp balance', 0n)
  const rMGP = useCachedUpdateable(() => wallet.account === undefined ? 0n : contracts[wallet.chain].rMGP.read.balanceOf([wallet.account]), [contracts, wallet.account], 'rmgp balance', 0n)
  const yMGP = useCachedUpdateable(() => wallet.account === undefined ? 0n : contracts[wallet.chain].yMGP.read.balanceOf([wallet.account]), [contracts, wallet.account], 'ymgp balance', 0n)
  const cMGP = useCachedUpdateable(() => wallet.account === undefined ? 0n : contracts[wallet.chain].cMGP.read.balanceOf([wallet.account]), [contracts, wallet.account], 'cmgp balance', 0n)
  const CKP = useCachedUpdateable(() => wallet.account === undefined ? 0n : contracts[wallet.chain].CKP.read.balanceOf([wallet.account]), [contracts, wallet.account], 'CKP balance', 0n)
  const PNP = useCachedUpdateable(() => wallet.account === undefined ? 0n : contracts[wallet.chain].PNP.read.balanceOf([wallet.account]), [contracts, wallet.account], 'PNP balance', 0n)
  const EGP = useCachedUpdateable(() => wallet.account === undefined ? 0n : contracts[wallet.chain].EGP.read.balanceOf([wallet.account]), [contracts, wallet.account], 'EGP balance', 0n)
  const LTP = useCachedUpdateable(() => wallet.account === undefined ? 0n : contracts[wallet.chain].LTP.read.balanceOf([wallet.account]), [contracts, wallet.account], 'LTP balance', 0n)
  const WETH = useCachedUpdateable(() => wallet.account === undefined ? 0n : contracts[wallet.chain].WETH.read.balanceOf([wallet.account]), [contracts, wallet.account], 'WETH balance', 0n)
  const ETH = useCachedUpdateable(() => wallet.account === undefined ? 0n : publicClients[wallet.chain].getBalance({ address: wallet.account }), [contracts, wallet.account], 'ETH balance', 0n)
  const [mgpCurve, updateMGPCurve] = useCachedUpdateable(() => contracts[wallet.chain].MGP.read.balanceOf([contracts[wallet.chain].cMGP.address]), [contracts, wallet.chain, wallet.account], 'mgpCurve balance', 0n)
  const [rmgpCurve, updateRMGPCurve] = useCachedUpdateable(() => contracts[wallet.chain].rMGP.read.balanceOf([contracts[wallet.chain].cMGP.address]), [contracts, wallet.chain, wallet.account], 'rmgpCurve balance', 0n)
  const [ymgpCurve, updateYMGPCurve] = useCachedUpdateable(() => contracts[wallet.chain].yMGP.read.balanceOf([contracts[wallet.chain].cMGP.address]), [contracts, wallet.chain, wallet.account], 'ymgpCurve balance', 0n)
  const [ymgpHoldings, updateYMGPHoldings] = useCachedUpdateable(() => contracts[wallet.chain].rMGP.read.balanceOf([contracts[wallet.chain].yMGP.address]), [contracts, wallet.chain, wallet.account], 'ymgpHoldings balance', 0n)
  return { MGP, rMGP, yMGP, cMGP, CKP, PNP, EGP, LTP, WETH, ETH, mgpCurve, rmgpCurve, ymgpCurve, ymgpHoldings, updateMGPCurve, updateRMGPCurve, updateYMGPCurve, updateYMGPHoldings }
}
