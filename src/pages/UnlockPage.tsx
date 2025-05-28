import { memo, type ReactElement } from 'react'
import { InfoCard } from '../components/InfoCard'
import { AmountInput } from '../components/AmountInput'

interface Props {
  readonly ymgpBalance: bigint,
  readonly sendAmount: bigint
  readonly setSendAmount: (_sendAmount: bigint) => void
  readonly unlockYMGP: () => void
}

export const UnlockPage = memo(({ ymgpBalance, sendAmount, setSendAmount, unlockYMGP }: Props): ReactElement => {
  return <>
    <div className="bg-gray-700/50 p-5 rounded-lg">
      <AmountInput label="Unlock yMGP" balance={ymgpBalance} value={sendAmount} onChange={setSendAmount} token={{ symbol: 'yMGP', color: 'bg-green-400', bgColor: 'bg-green-600' }} />
      <button type="submit" className="w-full py-3 rounded-lg transition-colors bg-green-600 hover:bg-green-700" onClick={unlockYMGP}>Unlock yMGP</button>
    </div>
    <InfoCard text={["yMGP can be locked to earn additional yield paid in rMGP. 5% of protocol yield and half of rMGP withdrawal fees are paid to yMGP lockers.", "Locked yMGP is able to vote on Magpie proposals with boosted vote power, controlling all of Reefi's vlMGP."]} />
  </>
})
UnlockPage.displayName = 'UnlockPage'
