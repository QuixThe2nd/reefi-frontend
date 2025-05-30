import { memo, type ReactElement } from 'react'
import { InfoCard } from '../components/InfoCard'
import { AmountInput } from '../components/AmountInput'
import { useGlobalContext } from '../contexts/GlobalContext'

export const UnlockPage = memo((): ReactElement => {
  const { balances, amounts, actions } = useGlobalContext()
  return <>
    <div className="bg-gray-700/50 p-5 rounded-lg mt-4">
      <AmountInput label="Get yMGP" balance={balances.YMGP[0]} value={amounts.send} onChange={amounts.setSend} token={{ symbol: 'yMGP', color: 'bg-green-400', bgColor: 'bg-green-600' }} />
      <button type="submit" className="w-full py-3 rounded-lg transition-colors bg-green-600 hover:bg-green-700" onClick={actions.unlockYMGP}>Unlock yMGP</button>
    </div>
    <InfoCard text={["yMGP can be unlocked instantly. Unlocked yMGP earns the underlying rMGP yield, but forfeits the additional yield."]} />
  </>
})
UnlockPage.displayName = 'UnlockPage'
