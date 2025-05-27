import { ReactElement } from 'react'
import { AmountInput } from '../components/AmountInput'
import { aprToApy } from '../utils'

interface Props {
  sendAmount: bigint,
  ymgpBalance: bigint | undefined,
  totalLockedYMGP: bigint | undefined,
  mgpAPR: number,
  reefiLockedMGP: bigint | undefined,
  setSendAmount: (value: bigint) => void
  lockYMGP: () => void
}

export const LockPage = ({ sendAmount, ymgpBalance, totalLockedYMGP, mgpAPR, reefiLockedMGP, setSendAmount, lockYMGP }: Props): ReactElement => {
  return <>
    <div className="bg-gray-700/50 p-5 rounded-lg">
      <AmountInput label="Lock yMGP" token={{ symbol: 'yMGP', color: 'bg-green-400', bgColor: 'bg-green-600' }} balance={ymgpBalance} value={sendAmount} onChange={setSendAmount} />
      <div className="mb-4 text-sm text-gray-400">
        <div className="flex justify-between mb-1">
          <span>Base APY</span>
          <span>{Math.round(10_000*aprToApy(mgpAPR)*0.9)/100}%</span>
        </div>
        <div className="flex justify-between mb-1">
          <span>Additional APY</span>
          <span>{Math.round(10_000*((Number(reefiLockedMGP)*aprToApy(mgpAPR)*0.05)/Number(totalLockedYMGP)))/100}%+</span>
        </div>
        <div className="flex justify-between mb-1">
          <span>Total APY</span>
          <span>{Math.round(10_000*(((Number(reefiLockedMGP)*aprToApy(mgpAPR)*0.05)/Number(totalLockedYMGP))+(aprToApy(mgpAPR)*0.9)))/100}%+</span>
        </div>
      </div>
      <button type="submit" className="w-full py-3 rounded-lg transition-colors bg-green-600 hover:bg-green-700" onClick={lockYMGP}>Lock yMGP</button>
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
