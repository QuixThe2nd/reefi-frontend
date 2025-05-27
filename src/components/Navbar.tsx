import type { ReactElement } from 'react'
import { Pages } from '../App'

export const Navbar = ({ page, setPage }: { page: Pages, setPage: (_page: Pages) => void }): ReactElement => {
  return <div className="flex justify-center mb-6">
    <div className="bg-gray-700 p-1 rounded-lg flex">
      <button type="button" className={`px-4 py-2 rounded-md transition-colors ${page === 'deposit' ? 'bg-green-600 text-white' : 'bg-transparent text-gray-400 hover:text-white'}`} onClick={() => setPage('deposit')}>Deposit MGP</button>
      <button type="button" className={`px-4 py-2 rounded-md transition-colors ${page === 'convert' ? 'bg-green-600 text-white' : 'bg-transparent text-gray-400 hover:text-white'}`} onClick={() => setPage('convert')}>Convert rMGP</button>
      <button type="button" className={`px-4 py-2 rounded-md transition-colors ${page === 'lock' ? 'bg-green-600 text-white' : 'bg-transparent text-gray-400 hover:text-white'}`} onClick={() => setPage('lock')}>Lock yMGP</button>
      <button type="button" className={`px-4 py-2 rounded-md transition-colors ${page === 'buyVotes' ? 'bg-green-600 text-white' : 'bg-transparent text-gray-400 hover:text-white'}`} onClick={() => setPage('buyVotes')}>Buy Votes</button>
      <button type="button" className={`px-4 py-2 rounded-md transition-colors ${page === 'supplyLiquidity' ? 'bg-green-600 text-white' : 'bg-transparent text-gray-400 hover:text-white'}`} onClick={() => setPage('supplyLiquidity')}>Supply Liquidity</button>
      <button type="button" className={`px-4 py-2 rounded-md transition-colors ${page === 'unlock' ? 'bg-green-600 text-white' : 'bg-transparent text-gray-400 hover:text-white'}`} onClick={() => setPage('unlock')}>Unlock yMGP</button>
      <button type="button" className={`px-4 py-2 rounded-md transition-colors ${page === 'redeem' ? 'bg-green-600 text-white' : 'bg-transparent text-gray-400 hover:text-white'}`} onClick={() => setPage('redeem')}>Redeem rMGP</button>
    </div>
  </div>
}
