import { useMemo } from "react"
import { parseEther } from "../utils"
import { contracts } from "../config/contracts"
import { useCachedUpdateable } from "./useUpdateable"
import { UseSupplies } from "./useSupplies"
import { UseWallet } from "./useWallet"
import { UseLocked } from "./useLocked"

export interface UseExchangeRates {
  readonly mintRMGP: number
  readonly curve: {
    readonly mgpRMGP: number
    readonly mgpYMGP: number
    readonly rmgpYMGP: number
    readonly rmgpMGP: number
    readonly ymgpRMGP: number
    readonly ymgpMGP: number
    readonly vmgpMGP: number
  }
}

interface Props {
  readonly locked: UseLocked
  readonly wallet: UseWallet
  readonly supplies: UseSupplies
}

export function useExchangeRates({ locked, wallet, supplies }: Props): UseExchangeRates {
  const mintRMGP = useMemo(() => { return supplies.rmgp === 0n ? 1 : (Number(locked.reefiMGP) / Number(supplies.rmgp)) }, [supplies.rmgp, locked.reefiMGP])
  const [mgpRMGP] = useCachedUpdateable(async () => { return Number(await contracts[wallet.chain].cMGP.read.get_dy([0n, 1n, parseEther(0.000_01)], { account: wallet.account }))/Number(parseEther(0.000_01)) }, [contracts, wallet.chain], 'mgpRMGP curve', 0)
  const [mgpYMGP] = useCachedUpdateable(async () => { return Number(await contracts[wallet.chain].cMGP.read.get_dy([0n, 2n, parseEther(0.000_01)], { account: wallet.account }))/Number(parseEther(0.000_01)) }, [contracts, wallet.chain], 'mgpYMGP curve', 0)
  const [rmgpYMGP] = useCachedUpdateable(async () => { return Number(await contracts[wallet.chain].cMGP.read.get_dy([1n, 2n, parseEther(0.000_01)], { account: wallet.account }))/Number(parseEther(0.000_01)) }, [contracts, wallet.chain], 'rmgpYMGP curve', 0)
  const [rmgpMGP] = useCachedUpdateable(async () => { return Number(await contracts[wallet.chain].cMGP.read.get_dy([1n, 0n, parseEther(0.000_01)], { account: wallet.account }))/Number(parseEther(0.000_01)) }, [contracts, wallet.chain], 'rmgpMGP curve', 0)
  const [ymgpRMGP] = useCachedUpdateable(async () => { return Number(await contracts[wallet.chain].cMGP.read.get_dy([2n, 1n, parseEther(0.000_01)], { account: wallet.account }))/Number(parseEther(0.000_01)) }, [contracts, wallet.chain], 'ymgpRMGP curve', 0)
  const [ymgpMGP] = useCachedUpdateable(async () => { return Number(await contracts[wallet.chain].cMGP.read.get_dy([2n, 0n, parseEther(0.000_01)], { account: wallet.account }))/Number(parseEther(0.000_01)) }, [contracts, wallet.chain], 'ymgpMGP curve', 0)
  const vmgpMGP = 0.8
  return { mintRMGP, curve: { mgpRMGP, mgpYMGP, rmgpYMGP, rmgpMGP, ymgpRMGP, ymgpMGP, vmgpMGP } }
}
