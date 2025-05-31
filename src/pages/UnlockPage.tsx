import { memo, type ReactElement } from 'react'
import { AmountInput } from '../components/AmountInput'
import { useGlobalContext } from '../contexts/GlobalContext'
import { Page } from '../components/Page'

export const UnlockPage = memo((): ReactElement => {
  const { balances, amounts, actions } = useGlobalContext()
  return <Page info={["yMGP can be unlocked instantly. Unlocked yMGP earns the underlying rMGP yield, but forfeits the additional yield."]}>
    <AmountInput label="Get yMGP" balance={balances.yMGP[0]} value={amounts.send} onChange={amounts.setSend} token={{ symbol: 'yMGP', color: 'bg-green-400', bgColor: 'bg-green-600' }} />
    <button type="submit" className="w-full py-2 rounded-lg transition-colors bg-green-600 hover:bg-green-700 h-min" onClick={actions.unlockYMGP}>Unlock yMGP</button>
  </Page>
})
UnlockPage.displayName = 'UnlockPage'
