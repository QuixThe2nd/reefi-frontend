import { createPublicClient, http, getContract, erc20Abi, GetContractReturnType, PublicClient, decodeFunctionData } from 'viem'
import { arbitrum, bsc, mainnet } from 'viem/chains'
import { ABIs } from './ABIs/abis'

type NonEmptyArray<T> = [T, ...T[]]

export type Chains = 56 | 42_161
export type Coins = 'MGP' | 'rMGP' | 'yMGP' | 'cMGP' | 'CKP' | 'PNP' | 'EGP' | 'LTP' | 'WETH'
export const decimals: Record<Coins | 'ETH', number> = { MGP: 18, rMGP: 18, yMGP: 18, cMGP: 18, CKP: 18, PNP: 18, EGP: 18, LTP: 18, WETH: 18, ETH: 18 }

type ContractAddresses = {
  [K in keyof typeof ABIs]: GetContractReturnType<typeof ABIs[K], PublicClient>
}
type Contracts = Record<Chains, ContractAddresses>

const calls: `0x${string}_0x${string}`[] = []
const onRPCRequest = async (request: Request): Promise<void> => {
  const body = await new Response(request.body).json() as { method: string, params: NonEmptyArray<{ data: `0x${string}`, to: `0x${string}` }> }[]
  for (const call of body) {
    if (call.method === 'eth_call') {
      const key = `${call.params[0].to}_${call.params[0].data}` as `0x${string}_0x${string}`
      if (calls.includes(key)) {
        for (const chain of Object.values(contracts)) {
          for (const contractName of Object.keys(chain) as (keyof typeof chain)[]) {
            const contract = chain[contractName]
            if (contract.address === call.params[0].to) {
              const decodedData = decodeFunctionData({ abi: contract.abi, data: call.params[0].data })
              // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, no-console
              console.log('Duplicate RPC Call', `${contractName}.${decodedData.functionName}(${decodedData.args === undefined ? '' : decodedData.args.join(', ')})`)
            }
          }
        }
      }
      else calls.push(key)
    }
  }
}

export const publicClients = {
  1: createPublicClient({ chain: mainnet, transport: http('https://eth.drpc.org', { retryDelay: 250, batch: { wait: 1000, batchSize: 3 }, onFetchRequest: onRPCRequest }) }),
  56: createPublicClient({ chain: bsc, transport: http('https://bsc-dataseed1.binance.org', { retryDelay: 250, batch: true, onFetchRequest: onRPCRequest }) }),
  42_161: createPublicClient({ chain: arbitrum, transport: http('https://arb1.arbitrum.io/rpc', { retryDelay: 1000, batch: { wait: 150 }, onFetchRequest: onRPCRequest }) })
}

export const coins: Record<Coins, { symbol: string; color: string; bgColor: string }> = {
  MGP: { symbol: 'MGP', color: 'bg-blue-400', bgColor: 'bg-blue-600' },
  rMGP: { symbol: 'RMGP', color: 'bg-green-400', bgColor: 'bg-green-600' },
  yMGP: { symbol: 'YMGP', color: 'bg-green-400', bgColor: 'bg-green-600' },
  cMGP: { symbol: 'CMGP', color: 'bg-indigo-400', bgColor: 'bg-indigo-600' },
  CKP: { symbol: 'CKP', color: 'bg-pink-400', bgColor: 'bg-pink-600' },
  PNP: { symbol: 'PNP', color: 'bg-orange-400', bgColor: 'bg-orange-600' },
  EGP: { symbol: 'EGP', color: 'bg-red-400', bgColor: 'bg-red-600' },
  LTP: { symbol: 'LTP', color: 'bg-teal-400', bgColor: 'bg-teal-600' },
  WETH: { symbol: 'ETH', color: 'bg-gray-400', bgColor: 'bg-gray-600' },
} as const

const bscContracts: ContractAddresses = {
  MGP: getContract({ address: '0xD06716E1Ff2E492Cc5034c2E81805562dd3b45fa' as const, abi: erc20Abi, client: publicClients[56] }),
  rMGP: getContract({ address: '0x0277517658a1dd3899bf926fCf6A633e549eB769' as const, abi: ABIs.rMGP, client: publicClients[56] }),
  yMGP: getContract({ address: '0xc7Fd6A7D4CDd26fD34948cA0fC2b07DdC84fe0Bb' as const, abi: ABIs.yMGP, client: publicClients[56] }),
  vMGP: getContract({ address: '0x0000000000000000000000000000000000000000' as const, abi: ABIs.vMGP, client: publicClients[56] }),
  cMGP: getContract({ address: '0x0000000000000000000000000000000000000000' as const, abi: ABIs.cMGP, client: publicClients[56] }),
  VLMGP: getContract({ address: '0x9B69b06272980FA6BAd9D88680a71e3c3BeB32c6' as const, abi: ABIs.VLMGP, client: publicClients[56] }),
  MASTERMGP: getContract({ address: '0xa3B615667CBd33cfc69843Bf11Fbb2A1D926BD46' as const, abi: ABIs.MASTERMGP, client: publicClients[56] }),
  VLREWARDER: getContract({ address: '0x9D29c8d733a3b6E0713D677F106E8F38c5649eF9' as const, abi: ABIs.VLREWARDER, client: publicClients[56] }),
  WETH: getContract({ address: '0x0000000000000000000000000000000000000000' as const, abi: ABIs.WETH, client: publicClients[56] }),
  WBNB: getContract({ address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c' as const, abi: ABIs.WBNB, client: publicClients[56] }),
  PNP: getContract({ address: '0x0000000000000000000000000000000000000000' as const, abi: ABIs.PNP, client: publicClients[56] }),
  CKP: getContract({ address: '0x0000000000000000000000000000000000000000' as const, abi: ABIs.CKP, client: publicClients[56] }),
  EGP: getContract({ address: '0x0000000000000000000000000000000000000000' as const, abi: ABIs.EGP, client: publicClients[56] }),
  LTP: getContract({ address: '0x0000000000000000000000000000000000000000' as const, abi: ABIs.LTP, client: publicClients[56] }),
  ODOSRouter: getContract({ address: '0x0000000000000000000000000000000000000000' as const, abi: ABIs.ODOSRouter, client: publicClients[56] }),
}

const arbContracts: ContractAddresses = {
  MGP: getContract({ address: '0xa61F74247455A40b01b0559ff6274441FAfa22A3' as const, abi: erc20Abi, client: publicClients[42_161] }),
  rMGP: getContract({ address: '0x3788c8791d826254bAbd49b602C93008468D5695' as const, abi: ABIs.rMGP, client: publicClients[42_161] }),
  yMGP: getContract({ address: '0x3975Eca44C64dCBE35d3aA227F05a97A811b30B9' as const, abi: ABIs.yMGP, client: publicClients[42_161] }),
  vMGP: getContract({ address: '0x0000000000000000000000000000000000000000' as const, abi: ABIs.vMGP, client: publicClients[42_161] }),
  cMGP: getContract({ address: '0xD1465c3489Aa7Eac0e7f9907F93a684840a2F934' as const, abi: ABIs.cMGP, client: publicClients[42_161] }),
  VLMGP: getContract({ address: '0x536599497Ce6a35FC65C7503232Fec71A84786b9' as const, abi: ABIs.VLMGP, client: publicClients[42_161] }),
  MASTERMGP: getContract({ address: '0x664cc2BcAe1E057EB1Ec379598c5B743Ad9Db6e7' as const, abi: ABIs.MASTERMGP, client: publicClients[42_161] }),
  VLREWARDER: getContract({ address: '0xAE7FDA9d3d6dceda5824c03A75948AaB4c933c45' as const, abi: ABIs.VLREWARDER, client: publicClients[42_161] }),
  WETH: getContract({ address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1' as const, abi: ABIs.WETH, client: publicClients[42_161] }),
  WBNB: getContract({ address: '0x20865e63B111B2649ef829EC220536c82C58ad7B' as const, abi: ABIs.WBNB, client: publicClients[42_161] }),
  PNP: getContract({ address: '0x2Ac2B254Bc18cD4999f64773a966E4f4869c34Ee' as const, abi: ABIs.PNP, client: publicClients[42_161] }),
  CKP: getContract({ address: '0x346Af1954e3d6be46B96dA713a1f7fD2d1928F1d' as const, abi: ABIs.CKP, client: publicClients[42_161] }),
  EGP: getContract({ address: '0x7E7a7C916c19a45769f6BDAF91087f93c6C12F78' as const, abi: ABIs.EGP, client: publicClients[42_161] }),
  LTP: getContract({ address: '0xa73959804651eEd0D4bd04293A675cB832c20454' as const, abi: ABIs.LTP, client: publicClients[42_161] }),
  ODOSRouter: getContract({ address: '0xa669e7A0d4b3e4Fa48af2dE86BD4CD7126Be4e13' as const, abi: ABIs.ODOSRouter, client: publicClients[42_161] }),
}

export const contracts: Contracts = {
  56: bscContracts,
  42_161: arbContracts
}
