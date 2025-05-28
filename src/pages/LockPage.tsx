import { memo, type ReactElement } from 'react'
import { AmountInput } from '../components/AmountInput'
import { aprToApy } from '../utils'
import { InfoCard } from '../components/InfoCard'

interface Props {
  readonly sendAmount: bigint,
  readonly ymgpBalance: bigint,
  readonly totalLockedYMGP: bigint,
  readonly mgpAPR: number,
  readonly reefiLockedMGP: bigint,
  readonly setSendAmount: (_value: bigint) => void
  readonly lockYMGP: () => void
}

export const LockPage = memo(({ sendAmount, ymgpBalance, totalLockedYMGP, mgpAPR, reefiLockedMGP, setSendAmount, lockYMGP }: Props): ReactElement => {
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
    <InfoCard text={[
      "yMGP can be locked to earn additional yield paid in rMGP. 5% of protocol yield and half of rMGP withdrawal fees are paid to yMGP lockers.",
      "Locked yMGP is able to vote on Magpie proposals with boosted vote power, controlling all of Reefi's vlMGP."
    ]} />
  </>
})
LockPage.displayName = 'LockPage'
