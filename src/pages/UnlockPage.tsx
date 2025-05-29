import { memo, type ReactElement } from 'react'
import { InfoCard } from '../components/InfoCard'
import { AmountInput } from '../components/AmountInput'
import { useGlobalContext } from '../contexts/GlobalContext'

export const UnlockPage = memo((): ReactElement => {
  const { balances, amounts, actions } = useGlobalContext()
  return <>
    <div className="bg-gray-700/50 p-5 rounded-lg">
      <AmountInput label="Unlock yMGP" balance={balances.ymgp} value={amounts.send} onChange={amounts.setSend} token={{ symbol: 'yMGP', color: 'bg-green-400', bgColor: 'bg-green-600' }} />
      <button type="submit" className="w-full py-3 rounded-lg transition-colors bg-green-600 hover:bg-green-700" onClick={actions.unlockYMGP}>Unlock yMGP</button>
    </div>
    <InfoCard text={["yMGP can be locked to earn additional yield paid in rMGP. 5% of protocol yield and half of rMGP withdrawal fees are paid to yMGP lockers.", "Locked yMGP is able to vote on Magpie proposals with boosted vote power, controlling all of Reefi's vlMGP."]} />
  </>
})
UnlockPage.displayName = 'UnlockPage'
