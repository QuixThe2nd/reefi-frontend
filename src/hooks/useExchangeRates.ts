import { useMemo } from "react"
import { parseEther } from "../utils"
import { Chains, contracts } from "../config/contracts"
import { useUpdateable } from "./useUpdateable"
import { Supplies } from "./useSupplies"

export interface ExchangeRates {
  readonly mintRMGP: number
  readonly curve: {
    readonly mgpRMGP: number
    readonly rmgpYMGP: number
    readonly rmgpMGP: number
    readonly ymgpRMGP: number
  }
}

interface Props {
  readonly reefiLockedMGP: bigint,
  readonly chain: Chains,
  readonly account: `0x${string}` | undefined,
  readonly supplies: Supplies
}

export const useExchangeRates = ({ reefiLockedMGP, chain, account, supplies }: Props): ExchangeRates => {
  const mintRMGP = useMemo(() => { return supplies.rmgp === 0n ? 1 : (Number(reefiLockedMGP) / Number(supplies.rmgp)) }, [supplies.rmgp, reefiLockedMGP])
  const [mgpRMGP] = useUpdateable(async () => { return Number(await contracts[chain].CMGP.read.get_dy([0n, 1n, parseEther(0.000_01)], { account }))/Number(parseEther(0.000_01)) }, [contracts, chain], 'mgpRMGP curve', 0)
  const [rmgpYMGP] = useUpdateable(async () => { return Number(await contracts[chain].CMGP.read.get_dy([1n, 2n, parseEther(0.000_01)], { account }))/Number(parseEther(0.000_01)) }, [contracts, chain], 'rmgpYMGP curve', 0)
  const [rmgpMGP] = useUpdateable(async () => { return Number(await contracts[chain].CMGP.read.get_dy([1n, 0n, parseEther(0.000_01)], { account }))/Number(parseEther(0.000_01)) }, [contracts, chain], 'rmgpMGP curve', 0)
  const [ymgpRMGP] = useUpdateable(async () => { return Number(await contracts[chain].CMGP.read.get_dy([2n, 1n, parseEther(0.000_01)], { account }))/Number(parseEther(0.000_01)) }, [contracts, chain], 'ymgpRMGP curve', 0)

  return { mintRMGP, curve: { mgpRMGP, rmgpYMGP, rmgpMGP, ymgpRMGP } }
}
