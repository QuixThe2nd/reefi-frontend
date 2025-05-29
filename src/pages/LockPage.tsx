import { memo, type ReactElement } from 'react'
import { AmountInput } from '../components/AmountInput'
import { aprToApy } from '../utils'
import { InfoCard } from '../components/InfoCard'
import { useGlobalContext } from '../contexts/GlobalContext'

export const LockPage = memo((): ReactElement => {
  const { actions, rewards, balances, amounts, locked } = useGlobalContext()
  return <>
    <div className="bg-gray-700/50 p-5 rounded-lg">
      <AmountInput label="Lock yMGP" token={{ symbol: 'yMGP', color: 'bg-green-400', bgColor: 'bg-green-600' }} balance={balances.YMGP[0]} value={amounts.send} onChange={amounts.setSend} />
      <div className="mb-4 text-sm text-gray-400">
        <div className="flex justify-between mb-1">
          <span>Base APY</span>
          <span>{Math.round(10_000*aprToApy(rewards.mgpAPR)*0.9)/100}%</span>
        </div>
        <div className="flex justify-between mb-1">
          <span>Additional APY</span>
          <span>{Math.round(10_000*((Number(locked.reefiMGP)*aprToApy(rewards.mgpAPR)*0.05)/Number(locked.ymgp)))/100}%+</span>
        </div>
        <div className="flex justify-between mb-1">
          <span>Total APY</span>
          <span>{Math.round(10_000*(((Number(locked.reefiMGP)*aprToApy(rewards.mgpAPR)*0.05)/Number(locked.ymgp))+(aprToApy(rewards.mgpAPR)*0.9)))/100}%+</span>
        </div>
      </div>
      <button type="submit" className="w-full py-3 rounded-lg transition-colors bg-green-600 hover:bg-green-700" onClick={actions.lockYMGP}>Lock yMGP</button>
    </div>
    <InfoCard text={[
      "yMGP can be locked to earn additional yield paid in rMGP. 5% of protocol yield and half of rMGP withdrawal fees are paid to yMGP lockers.",
      "Locked yMGP is able to vote on Magpie proposals with boosted vote power, controlling all of Reefi's vlMGP."
    ]} />
  </>
})
LockPage.displayName = 'LockPage'
