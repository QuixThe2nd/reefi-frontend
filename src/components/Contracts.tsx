import type { ReactElement } from 'react'
import { Chains } from '../App'
import { PublicClient } from 'viem'

export const Contracts = ({ contracts, publicClients, chain }: { contracts: Record<Chains, Record<string, { address: string }>>, publicClients: Record<Chains, PublicClient>, chain: Chains }): ReactElement => {
  return <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 mb-6">
    <h2 className="text-lg font-bold mb-2">Contract Addresses</h2>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 text-xs">
      {(Object.keys(contracts[chain]) as (keyof typeof contracts[Chains])[]).map(contract => <div key={contract}>
        <span className="font-semibold">{contract}:</span>
        <a href={`${publicClients[chain].chain?.blockExplorers?.default.url}/address/${contracts[chain][contract]?.address}`} className="ml-2 break-all text-green-300">{contracts[chain][contract]?.address}</a>
      </div>)}
    </div>
  </div>
}
