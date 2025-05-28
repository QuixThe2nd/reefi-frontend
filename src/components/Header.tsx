import type { ReactElement } from 'react'
import { TokenBalances } from './TokenBalances'
import { Chains, Coins } from '../config/contracts'

interface Props {
  readonly account: `0x${string}` | undefined
  readonly ens: string | null | undefined
  readonly chain: Chains
  readonly decimals: Readonly<Record<Coins, number>>
  readonly mgpBalance: bigint
  readonly rmgpBalance: bigint
  readonly ymgpBalance: bigint
  // readonly vmgpBalance: bigint
  readonly cmgpBalance: bigint
  readonly userLockedYMGP: bigint
  readonly isConnecting: boolean
  readonly connectWallet: () => void
  readonly setChain: (_chain: Chains) => void
}

export const Header = ({ account, ens, chain, decimals, mgpBalance, rmgpBalance, ymgpBalance, cmgpBalance, userLockedYMGP, isConnecting, connectWallet, setChain }: Props): ReactElement => {
  return <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 mb-6 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold">REEFI</h1>
        <p>Refinance Magpie Yield and Governance</p>
      </div>
      {account !== undefined ? <div className="flex items-center space-x-4">
        <TokenBalances decimals={decimals} mgpBalance={mgpBalance} rmgpBalance={rmgpBalance} ymgpBalance={ymgpBalance} cmgpBalance={cmgpBalance} userLockedYMGP={userLockedYMGP} />
        <div className="bg-green-600/20 text-green-400 rounded-lg px-3 py-2 text-sm">{ens ?? `${account.slice(0, 6)}...${account.slice(-4)}`}</div>
        <select className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white" value={chain} onChange={e => {
          setChain(Number(e.target.value) as 56 | 42161)
          window.localStorage.setItem('chain', String(e.target.value))
        }}>
          <option value="56">BNB Chain</option>
          <option value="42161">Arbitrum</option>
        </select>
      </div> : <button type="button" className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors" onClick={connectWallet} disabled={isConnecting}>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</button>}
    </div>
}
