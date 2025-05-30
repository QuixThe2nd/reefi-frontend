import { memo, type ReactElement } from 'react'
import { TokenBalances } from './TokenBalances'
import { useGlobalContext } from '../contexts/GlobalContext'

export const Header = memo((): ReactElement => {
  const { wallet } = useGlobalContext()
  return <div className="fixed w-full bg-gray-800 p-4 flex justify-between items-center z-1">
    <div className="flex items-center gap-4">
      <h1 className="text-xl font-bold">REEFI</h1>
      <p>Refinance Magpie Yield and Governance</p>
    </div>
    {wallet.account === undefined ? <button type="button" className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors" onClick={wallet.connectWallet} disabled={wallet.isConnecting}>{wallet.isConnecting ? 'Connecting...' : 'Connect Wallet'}</button> : <div className="flex items-center space-x-4">
      <TokenBalances />
      <div className="bg-green-600/20 text-green-400 rounded-lg px-3 py-2 text-sm">{wallet.ens ?? `${wallet.account.slice(0, 6)}...${wallet.account.slice(-4)}`}</div>
      <select className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white" value={wallet.chain} onChange={e => {
        wallet.setChain(Number(e.target.value) as 56 | 42_161)
        globalThis.localStorage.setItem('chain', String(e.target.value))
      }}>
        <option value="56">BNB Chain</option>
        <option value="42161">Arbitrum</option>
      </select>
    </div>}
  </div>
})
Header.displayName = 'Header'
