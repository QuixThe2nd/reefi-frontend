import { useMemo } from "react"
import { getContract, GetContractReturnType, PublicActions, WalletClient } from "viem"
import { Chains, contracts } from "../config/contracts"
import { ABIs } from "../config/ABIs/abis"
import { UseWallet } from "./useWallet"

type ContractAddresses = {
  [K in keyof typeof ABIs]: GetContractReturnType<typeof ABIs[K], WalletClient & PublicActions>
}
type Contracts = Record<Chains, ContractAddresses>

export type UseContracts<Clients> = Clients extends undefined ? undefined : Contracts

export const useContracts = ({ wallet }: { wallet: UseWallet }): UseContracts<typeof wallet['clients']> => {
  const writeContracts = useMemo(() => {
    if (!wallet.clients) return
    return {
      56: {
        MGP: getContract({ address: contracts[56].MGP.address, abi: ABIs.MGP, client: wallet.clients[56] }),
        rMGP: getContract({ address: contracts[56].rMGP.address, abi: ABIs.rMGP, client: wallet.clients[56] }),
        yMGP: getContract({ address: contracts[56].yMGP.address, abi: ABIs.yMGP, client: wallet.clients[56] }),
        vMGP: getContract({ address: contracts[56].vMGP.address, abi: ABIs.vMGP, client: wallet.clients[56] }),
        cMGP: getContract({ address: contracts[56].cMGP.address, abi: ABIs.cMGP, client: wallet.clients[56] }),
        VLMGP: getContract({ address: contracts[56].VLMGP.address, abi: ABIs.VLMGP, client: wallet.clients[56] }),
        masterMGP: getContract({ address: contracts[56].MASTERMGP.address, abi: ABIs.MASTERMGP, client: wallet.clients[56] }),
        VLREWARDER: getContract({ address: contracts[56].VLREWARDER.address, abi: ABIs.VLREWARDER, client: wallet.clients[56] }),
        // stakedCMGP: getContract({ address: contracts[56].stakedCMGP.address, abi: ABIs.stakedCMGP, client: wallet.clients[56] }),        CKP: getContract({ address: contracts[56].CKP.address, abi: ABIs.CKP, client: wallet.clients[56] }),
        PNP: getContract({ address: contracts[56].PNP.address, abi: ABIs.PNP, client: wallet.clients[56] }),
        EGP: getContract({ address: contracts[56].EGP.address, abi: ABIs.EGP, client: wallet.clients[56] }),
        LTP: getContract({ address: contracts[56].LTP.address, abi: ABIs.LTP, client: wallet.clients[56] }),
        WETH: getContract({ address: contracts[56].WETH.address, abi: ABIs.WETH, client: wallet.clients[56] }),
        WBNB: getContract({ address: contracts[56].WBNB.address, abi: ABIs.WBNB, client: wallet.clients[56] }),
        MASTERMGP: getContract({ address: contracts[56].MASTERMGP.address, abi: ABIs.MASTERMGP, client: wallet.clients[56] }),
        CKP: getContract({ address: contracts[56].CKP.address, abi: ABIs.CKP, client: wallet.clients[56] }),
        ODOSRouter: getContract({ address: contracts[56].ODOSRouter.address, abi: ABIs.ODOSRouter, client: wallet.clients[56] }),
      },
      42_161: {
        MGP: getContract({ address: contracts[42_161].MGP.address, abi: ABIs.MGP, client: wallet.clients[42_161] }),
        rMGP: getContract({ address: contracts[42_161].rMGP.address, abi: ABIs.rMGP, client: wallet.clients[42_161] }),
        yMGP: getContract({ address: contracts[42_161].yMGP.address, abi: ABIs.yMGP, client: wallet.clients[42_161] }),
        cMGP: getContract({ address: contracts[42_161].cMGP.address, abi: ABIs.cMGP, client: wallet.clients[42_161] }),
        VLMGP: getContract({ address: contracts[42_161].VLMGP.address, abi: ABIs.VLMGP, client: wallet.clients[42_161] }),
        masterMGP: getContract({ address: contracts[42_161].MASTERMGP.address, abi: ABIs.MASTERMGP, client: wallet.clients[42_161] }),
        VLREWARDER: getContract({ address: contracts[42_161].VLREWARDER.address, abi: ABIs.VLREWARDER, client: wallet.clients[42_161] }),
        // stakedCMGP: getContract({ address: contracts[42_161].stakedCMGP.address, abi: ABIs.stakedCMGP, client: wallet.clients[42_161] }),
        PNP: getContract({ address: contracts[42_161].PNP.address, abi: ABIs.PNP, client: wallet.clients[42_161] }),
        EGP: getContract({ address: contracts[42_161].EGP.address, abi: ABIs.EGP, client: wallet.clients[42_161] }),
        LTP: getContract({ address: contracts[42_161].LTP.address, abi: ABIs.LTP, client: wallet.clients[42_161] }),
        WETH: getContract({ address: contracts[42_161].WETH.address, abi: ABIs.WETH, client: wallet.clients[42_161] }),
        WBNB: getContract({ address: contracts[42_161].WBNB.address, abi: ABIs.WBNB, client: wallet.clients[42_161] }),
        vMGP: getContract({ address: contracts[42_161].vMGP.address, abi: ABIs.vMGP, client: wallet.clients[42_161] }),
        MASTERMGP: getContract({ address: contracts[42_161].MASTERMGP.address, abi: ABIs.MASTERMGP, client: wallet.clients[42_161] }),
        CKP: getContract({ address: contracts[42_161].CKP.address, abi: ABIs.CKP, client: wallet.clients[42_161] }),
        ODOSRouter: getContract({ address: contracts[42_161].ODOSRouter.address, abi: ABIs.ODOSRouter, client: wallet.clients[42_161] }),
      }
    }
  }, [wallet.clients])

  return writeContracts
}
