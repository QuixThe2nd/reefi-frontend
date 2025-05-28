import { useMemo } from "react"
import { parseEther } from "../utils"
import { Chains, contracts } from "../config/contracts"
import { useUpdateable } from "./useUpdateable"
import { useSupplies } from "./useSupplies"

export const useExchangeRates = ({ reefiLockedMGP, chain, account }: { reefiLockedMGP: bigint | undefined, chain: Chains, account: `0x${string}` }) => {
  const supplies = useSupplies({ chain })

  const mintRMGP = useMemo(() => { return supplies.rmgp === 0n ? 1 : (Number(reefiLockedMGP) / Number(supplies.rmgp)) }, [supplies.rmgp, reefiLockedMGP])
  const [mgpRMGP] = useUpdateable(async () => { return Number(await contracts[chain].CMGP.read.get_dy([0n, 1n, parseEther(0.00001)], { account }))/Number(parseEther(0.00001)) }, [contracts, chain])
  const [rmgpYMGP] = useUpdateable(async () => { return Number(await contracts[chain].CMGP.read.get_dy([1n, 2n, parseEther(0.00001)], { account }))/Number(parseEther(0.00001)) }, [contracts, chain])

  return { mintRMGP, curve: { mgpRMGP, rmgpYMGP } }
}
