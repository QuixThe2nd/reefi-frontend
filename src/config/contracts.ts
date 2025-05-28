import { createPublicClient, webSocket, getContract, erc20Abi } from 'viem'
import { arbitrum, bsc, mainnet } from 'viem/chains'
import { ABIs } from './ABIs/abis'

export type Chains = 56 | 42161
export type Coins = 'MGP' | 'RMGP' | 'YMGP' | 'VMGP' | 'CMGP' | 'CKP' | 'PNP' | 'EGP' | 'LTP' | 'ETH' | 'BNB'
export const decimals: Record<Coins, number> = { MGP: 18, RMGP: 18, YMGP: 18, VMGP: 18, CMGP: 18, CKP: 18, PNP: 18, EGP: 18, LTP: 18, ETH: 18, BNB: 18 }

export const publicClients = {
  1: createPublicClient({ chain: mainnet, transport: webSocket('wss://eth.drpc.org') }),
  56: createPublicClient({ chain: bsc, transport: webSocket('wss://bsc.drpc.org') }),
  42161: createPublicClient({ chain: arbitrum, transport: webSocket('wss://arbitrum.drpc.org') })
}



export const contracts = {
  56: {
    MGP: getContract({ address: '0xD06716E1Ff2E492Cc5034c2E81805562dd3b45fa' as `0x${string}`, abi: erc20Abi, client: publicClients[56] }),
    RMGP: getContract({ address: '0x0277517658a1dd3899bf926fCf6A633e549eB769' as `0x${string}`, abi: ABIs.RMGP, client: publicClients[56] }),
    YMGP: getContract({ address: '0xc7Fd6A7D4CDd26fD34948cA0fC2b07DdC84fe0Bb' as `0x${string}`, abi: ABIs.YMGP, client: publicClients[56] }),
    // VMGP: getContract({ address: '0x0000000000000000000000000000000000000000' as `0x${string}`, abi: ABIs.VMGP, client: publicClients[56] }),
    CMGP: getContract({ address: '0x0000000000000000000000000000000000000000' as `0x${string}`, abi: ABIs.CMGP, client: publicClients[56] }),
    VLMGP: getContract({ address: '0x9B69b06272980FA6BAd9D88680a71e3c3BeB32c6' as `0x${string}`, abi: ABIs.VLMGP, client: publicClients[56] }),
    MASTERMGP: getContract({ address: '0xa3B615667CBd33cfc69843Bf11Fbb2A1D926BD46' as `0x${string}`, abi: ABIs.MASTERMGP, client: publicClients[56] }),
    VLREWARDER: getContract({ address: '0x9D29c8d733a3b6E0713D677F106E8F38c5649eF9' as `0x${string}`, abi: ABIs.VLREWARDER, client: publicClients[56] }),
    WETH: getContract({ address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c' as `0x${string}`, abi: erc20Abi, client: publicClients[56] }),
  },
  42161: {
    MGP: getContract({ address: '0xa61F74247455A40b01b0559ff6274441FAfa22A3' as `0x${string}`, abi: erc20Abi, client: publicClients[42161] }),
    RMGP: getContract({ address: '0x3788c8791d826254bAbd49b602C93008468D5695' as `0x${string}`, abi: ABIs.RMGP, client: publicClients[42161] }),
    YMGP: getContract({ address: '0x3975Eca44C64dCBE35d3aA227F05a97A811b30B9' as `0x${string}`, abi: ABIs.YMGP, client: publicClients[42161] }),
    // VMGP: getContract({ address: '0x0000000000000000000000000000000000000000' as `0x${string}`, abi: ABIs.VMGP, client: publicClients[42161] }),
    CMGP: getContract({ address: '0xA24Daae84B8166Ab0C049880F4F8F3AdC4F0a421' as `0x${string}`, abi: ABIs.CMGP, client: publicClients[42161] }),
    VLMGP: getContract({ address: '0x536599497Ce6a35FC65C7503232Fec71A84786b9' as `0x${string}`, abi: ABIs.VLMGP, client: publicClients[42161] }),
    MASTERMGP: getContract({ address: '0x664cc2BcAe1E057EB1Ec379598c5B743Ad9Db6e7' as `0x${string}`, abi: ABIs.MASTERMGP, client: publicClients[42161] }),
    VLREWARDER: getContract({ address: '0xAE7FDA9d3d6dceda5824c03A75948AaB4c933c45' as `0x${string}`, abi: ABIs.VLREWARDER, client: publicClients[42161] }),
    WETH: getContract({ address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1' as `0x${string}`, abi: erc20Abi, client: publicClients[42161] }),
  }
}