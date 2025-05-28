import { useMemo } from "react"
import { getContract, PublicActions, WalletClient } from "viem"
import { Chains, contracts } from "../config/contracts"

export const useContracts = ({ clients }: { clients: Record<Chains, WalletClient & PublicActions> | undefined }) => {
  const writeContracts = useMemo(() => {
    if (!clients) return undefined
    return {
      56: {
        MGP: getContract({ address: '0xD06716E1Ff2E492Cc5034c2E81805562dd3b45fa' as `0x${string}`, abi: contracts[56].MGP.abi, client: clients[56] }),
        RMGP: getContract({ address: '0x0277517658a1dd3899bf926fCf6A633e549eB769' as `0x${string}`, abi: contracts[56].RMGP.abi, client: clients[56] }),
        YMGP: getContract({ address: '0xc7Fd6A7D4CDd26fD34948cA0fC2b07DdC84fe0Bb' as `0x${string}`, abi: contracts[56].YMGP.abi, client: clients[56] }),
        CMGP: getContract({ address: '0x0000000000000000000000000000000000000000' as `0x${string}`, abi: contracts[56].CMGP.abi, client: clients[56] }),
        VLMGP: getContract({ address: '0x9B69b06272980FA6BAd9D88680a71e3c3BeB32c6' as `0x${string}`, abi: contracts[56].VLMGP.abi, client: clients[56] }),
        masterMGP: getContract({ address: '0xa3B615667CBd33cfc69843Bf11Fbb2A1D926BD46' as `0x${string}`, abi: contracts[56].MASTERMGP.abi, client: clients[56] }),
        VLREWARDER: getContract({ address: '0x9D29c8d733a3b6E0713D677F106E8F38c5649eF9' as `0x${string}`, abi: contracts[56].VLREWARDER.abi, client: clients[56] }),
        // stakedCMGP: getContract({ address: '0x0000000000000000000000000000000000000000' as `0x${string}`, abi: erc20Abi, client: clients[56] }),
        WETH: getContract({ address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c' as `0x${string}`, abi: contracts[56].WETH.abi, client: clients[56] }),
      },
      42161: {
        MGP: getContract({ address: '0xa61F74247455A40b01b0559ff6274441FAfa22A3' as `0x${string}`, abi: contracts[42161].MGP.abi, client: clients[42161] }),
        RMGP: getContract({ address: '0x3788c8791d826254bAbd49b602C93008468D5695' as `0x${string}`, abi: contracts[42161].RMGP.abi, client: clients[42161] }),
        YMGP: getContract({ address: '0x3975Eca44C64dCBE35d3aA227F05a97A811b30B9' as `0x${string}`, abi: contracts[42161].YMGP.abi, client: clients[42161] }),
        CMGP: getContract({ address: '0xc370A85bB555A7c519bF675895E545873BDb1359' as `0x${string}`, abi: contracts[42161].CMGP.abi, client: clients[42161] }),
        VLMGP: getContract({ address: '0x536599497Ce6a35FC65C7503232Fec71A84786b9' as `0x${string}`, abi: contracts[42161].VLMGP.abi, client: clients[42161] }),
        masterMGP: getContract({ address: '0x664cc2BcAe1E057EB1Ec379598c5B743Ad9Db6e7' as `0x${string}`, abi: contracts[42161].MASTERMGP.abi, client: clients[42161] }),
        VLREWARDER: getContract({ address: '0xAE7FDA9d3d6dceda5824c03A75948AaB4c933c45' as `0x${string}`, abi: contracts[42161].VLREWARDER.abi, client: clients[42161] }),
        // stakedCMGP: getContract({ address: '0x4eD2ea51f31e226567D63cf009051E6e81c0aF97' as `0x${string}`, abi: erc20Abi, client: clients[42161] }),
        WETH: getContract({ address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1' as `0x${string}`, abi: contracts[42161].WETH.abi, client: clients[42161] }),
      }
    }
  }, [clients])

  return { write: writeContracts, read: contracts }
}
