import { ReactElement } from 'react'
import { formatEther, parseEther } from '../utils'
import { Coins } from '../App'

interface Props {
  ymgpBalance: bigint | undefined,
  decimals: Record<Coins, number>,
  sendAmount: bigint
  setSendAmount: (sendAmount: bigint) => void
  unlockYMGP: () => void
}

export const UnlockPage = ({ ymgpBalance, decimals, sendAmount, setSendAmount, unlockYMGP }: Props): ReactElement => {
  return <>
    <div className="bg-gray-700/50 p-5 rounded-lg">
      <div className="flex justify-between items-center mb-1">
        <h3 className="text-md font-medium">Unlock yMGP</h3>
        <div className="text-sm text-gray-400">Balance: {ymgpBalance !== undefined ? formatEther(ymgpBalance, decimals.YMGP) : 'Loading...'} yMGP</div>
      </div>
      <div className="bg-gray-900 rounded-lg p-4 flex items-center justify-between mb-4">
        <input type="text" placeholder="0.0" className="bg-transparent outline-none text-xl w-3/4" value={formatEther(sendAmount)} onChange={e => setSendAmount(parseEther(Number.isNaN(Number.parseFloat(e.target.value)) ? 0 : Number.parseFloat(e.target.value)))} />
        <div className="flex items-center space-x-2">
          <button type="button" className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded" onClick={() => setSendAmount(ymgpBalance ?? 0n)}>MAX</button>
          <div className="rounded-md px-3 py-1 flex items-center bg-green-600">
            <div className="w-5 h-5 rounded-full flex items-center justify-center mr-2 bg-green-500">Y</div>
            <span>yMGP</span>
          </div>
        </div>
      </div>
      <button type="submit" className="w-full py-3 rounded-lg transition-colors bg-green-600 hover:bg-green-700" onClick={unlockYMGP}>Unlock yMGP</button>
    </div>
    <div className="mt-4 bg-indigo-900/20 border border-green-800/30 rounded-lg p-3 text-sm">
      <div className="flex items-start">
        <div className="p-1 bg-indigo-800/30 rounded-full mr-3 mt-0.5">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400"><title>Info</title><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
        </div>
        <div>
          <span className="font-medium text-indigo-300">About</span>
          <p className="text-gray-300 mt-1">yMGP can be locked to earn additional yield paid in rMGP. 5% of protocol yield and half of rMGP withdrawal fees are paid to yMGP lockers.</p>
          <p className="text-gray-300 mt-1">Locked yMGP is able to vote on Magpie proposals with boosted vote power, controlling all of Reefi&apos;s vlMGP.</p>
        </div>
      </div>
    </div>
  </>
}
