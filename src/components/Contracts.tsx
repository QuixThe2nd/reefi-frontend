import { memo, type ReactElement } from 'react'
import { Chains, contracts, publicClients } from '../config/contracts'
import { useGlobalContext } from '../contexts/GlobalContext'

export const Contracts = memo((): ReactElement => {
  const { wallet } = useGlobalContext()

  return <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 mb-6">
    <h2 className="text-lg font-bold mb-2">Contract Addresses</h2>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 text-xs">
      {(Object.keys(contracts[wallet.chain]) as (keyof typeof contracts[Chains])[]).map(contract => <div key={contract}>
        <span className="font-semibold">{contract}:</span>
        <a href={`${publicClients[wallet.chain].chain.blockExplorers.default.url}/address/${contracts[wallet.chain][contract].address}`} className="ml-2 break-all text-green-300">{contracts[wallet.chain][contract].address}</a>
      </div>)}
    </div>
  </div>
})
Contracts.displayName = 'Contracts'
