import { useMemo } from "react"
import { getContract, GetContractReturnType, PublicActions, WalletClient } from "viem"
import { Chains, contracts } from "../config/contracts"
import { ABIs } from "../config/ABIs/abis"

interface Props {
  readonly clients: Record<Chains, WalletClient & PublicActions> | undefined
}

type Contracts = Record<Chains, {
  MGP: GetContractReturnType<typeof ABIs.MGP, WalletClient & PublicActions>
  RMGP: GetContractReturnType<typeof ABIs.RMGP, WalletClient & PublicActions>
  YMGP: GetContractReturnType<typeof ABIs.YMGP, WalletClient & PublicActions>
  CMGP: GetContractReturnType<typeof ABIs.CMGP, WalletClient & PublicActions>
  VLMGP: GetContractReturnType<typeof ABIs.VLMGP, WalletClient & PublicActions>
  masterMGP: GetContractReturnType<typeof ABIs.MASTERMGP, WalletClient & PublicActions>
  VLREWARDER: GetContractReturnType<typeof ABIs.VLREWARDER, WalletClient & PublicActions>
  WETH: GetContractReturnType<typeof ABIs.WETH, WalletClient & PublicActions>
}> | undefined

export const useContracts = ({ clients }: Props): Contracts => {
  const writeContracts = useMemo(() => {
    if (!clients) return undefined
    return {
      56: {
        MGP: getContract({ address: contracts[56].MGP.address, abi: ABIs.MGP, client: clients[56] }),
        RMGP: getContract({ address: contracts[56].RMGP.address, abi: ABIs.RMGP, client: clients[56] }),
        YMGP: getContract({ address: contracts[56].YMGP.address, abi: ABIs.YMGP, client: clients[56] }),
        CMGP: getContract({ address: contracts[56].CMGP.address, abi: ABIs.CMGP, client: clients[56] }),
        VLMGP: getContract({ address: contracts[56].VLMGP.address, abi: ABIs.VLMGP, client: clients[56] }),
        masterMGP: getContract({ address: contracts[56].MASTERMGP.address, abi: ABIs.MASTERMGP, client: clients[56] }),
        VLREWARDER: getContract({ address: contracts[56].VLREWARDER.address, abi: ABIs.VLREWARDER, client: clients[56] }),
        // stakedCMGP: getContract({ address: contracts[56].stakedCMGP.address, abi: ABIs.stakedCMGP, client: clients[56] }),
        WETH: getContract({ address: contracts[56].WETH.address, abi: ABIs.WETH, client: clients[56] }),
      },
      42161: {
        MGP: getContract({ address: contracts[42161].MGP.address, abi: ABIs.MGP, client: clients[42161] }),
        RMGP: getContract({ address: contracts[42161].RMGP.address, abi: ABIs.RMGP, client: clients[42161] }),
        YMGP: getContract({ address: contracts[42161].YMGP.address, abi: ABIs.YMGP, client: clients[42161] }),
        CMGP: getContract({ address: contracts[42161].CMGP.address, abi: ABIs.CMGP, client: clients[42161] }),
        VLMGP: getContract({ address: contracts[42161].VLMGP.address, abi: ABIs.VLMGP, client: clients[42161] }),
        masterMGP: getContract({ address: contracts[42161].MASTERMGP.address, abi: ABIs.MASTERMGP, client: clients[42161] }),
        VLREWARDER: getContract({ address: contracts[42161].VLREWARDER.address, abi: ABIs.VLREWARDER, client: clients[42161] }),
        // stakedCMGP: getContract({ address: contracts[42161].stakedCMGP.address, abi: ABIs.stakedCMGP, client: clients[42161] }),
        WETH: getContract({ address: contracts[42161].WETH.address, abi: ABIs.WETH, client: clients[42161] }),
      }
    }
  }, [clients])

  return writeContracts
}
