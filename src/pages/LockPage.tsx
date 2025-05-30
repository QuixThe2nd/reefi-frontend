import { memo, type ReactElement } from 'react'
import { AmountInput } from '../components/AmountInput'
import { aprToApy } from '../utils'
import { useGlobalContext } from '../contexts/GlobalContext'
import { Page } from '../components/Page'

export const LockPage = memo((): ReactElement => {
  const { actions, rewards, balances, amounts, locked } = useGlobalContext()
  return <Page info={[
    "yMGP can be locked to earn additional yield paid in rMGP. 5% of protocol yield and half of rMGP withdrawal fees are paid to yMGP lockers.",
    "Locked yMGP is able to vote on Magpie proposals with boosted vote power, controlling all of Reefi's vlMGP."
  ]}>
    <AmountInput label="Lock yMGP" token={{ symbol: 'yMGP', color: 'bg-green-400', bgColor: 'bg-green-600' }} balance={balances.YMGP[0]} value={amounts.send} onChange={amounts.setSend} />
    <button type="submit" className="w-full py-2 rounded-lg transition-colors bg-green-600 hover:bg-green-700 h-min" onClick={actions.lockYMGP}>Lock yMGP</button>
    <div className="mt-4 text-sm text-gray-400">
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
  </Page>
})
LockPage.displayName = 'LockPage'
