import { useCachedUpdateable } from './useUpdateable'
import { Coins, contracts } from '../config/contracts'
import { UseWallet } from './useWallet'

type Contracts = Record<Coins, [bigint, () => void]>

export interface UseAllowances {
  readonly MGP: [bigint, () => void]
  readonly RMGP: [bigint, () => void]
  readonly curve: Contracts
}

export const useAllowances = ({ wallet }: { readonly wallet: UseWallet }): UseAllowances => {
  const MGP = useCachedUpdateable(() => wallet.account === undefined ? 0n : contracts[wallet.chain].MGP.read.allowance([wallet.account, contracts[wallet.chain].RMGP.address]), [contracts, wallet.chain, wallet.account], 'mgp allowance', 0n)
  const RMGP = useCachedUpdateable(() => wallet.account === undefined ? 0n : contracts[wallet.chain].RMGP.read.allowance([wallet.account, contracts[wallet.chain].YMGP.address]), [contracts, wallet.chain, wallet.account], 'rmgp allowance', 0n)
  // const [ymgp, updateYMGP] = useCachedUpdateable(() => wallet.account === undefined ? 0n : contracts[wallet.chain].YMGP.read.allowance([wallet.account, contracts[wallet.chain].VMGP.address]), [contracts, wallet.chain, wallet.account], 'ymgp allowance', 0n)
  const curve: Contracts = {
    MGP: useCachedUpdateable(() => wallet.account === undefined ? 0n : contracts[wallet.chain].MGP.read.allowance([wallet.account, contracts[wallet.chain].CMGP.address]), [contracts, wallet.chain, wallet.account], 'mgpCurve allowance', 0n),
    RMGP: useCachedUpdateable(() => wallet.account === undefined ? 0n : contracts[wallet.chain].RMGP.read.allowance([wallet.account, contracts[wallet.chain].CMGP.address]), [contracts, wallet.chain, wallet.account], 'rmgpCurve allowance', 0n),
    YMGP: useCachedUpdateable(() => wallet.account === undefined ? 0n : contracts[wallet.chain].YMGP.read.allowance([wallet.account, contracts[wallet.chain].CMGP.address]), [contracts, wallet.account], 'ymgpCurve allowance', 0n),
    CMGP: useCachedUpdateable(() => wallet.account === undefined ? 0n : contracts[wallet.chain].CMGP.read.allowance([wallet.account, contracts[wallet.chain].CMGP.address]), [contracts, wallet.account], 'CMGPCurve allowance', 0n),
    CKP: useCachedUpdateable(() => wallet.account === undefined ? 0n : contracts[wallet.chain].CKP.read.allowance([wallet.account, contracts[wallet.chain].CMGP.address]), [contracts, wallet.account], 'CKPCurve allowance', 0n),
    PNP: useCachedUpdateable(() => wallet.account === undefined ? 0n : contracts[wallet.chain].PNP.read.allowance([wallet.account, contracts[wallet.chain].CMGP.address]), [contracts, wallet.account], 'PNPCurve allowance', 0n),
    EGP: useCachedUpdateable(() => wallet.account === undefined ? 0n : contracts[wallet.chain].EGP.read.allowance([wallet.account, contracts[wallet.chain].CMGP.address]), [contracts, wallet.account], 'EGPCurve allowance', 0n),
    LTP: useCachedUpdateable(() => wallet.account === undefined ? 0n : contracts[wallet.chain].LTP.read.allowance([wallet.account, contracts[wallet.chain].CMGP.address]), [contracts, wallet.account], 'LTPCurve allowance', 0n),
    ETH: useCachedUpdateable(() => wallet.account === undefined ? 0n : contracts[wallet.chain].ETH.read.allowance([wallet.account, contracts[wallet.chain].CMGP.address]), [contracts, wallet.account], 'ETHCurve allowance', 0n),
    BNB: useCachedUpdateable(() => wallet.account === undefined ? 0n : contracts[wallet.chain].BNB.read.allowance([wallet.account, contracts[wallet.chain].CMGP.address]), [contracts, wallet.account], 'BNBCurve allowance', 0n),
  }
  return { MGP, RMGP, curve }
}