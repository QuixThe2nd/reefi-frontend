import { memo, type ReactElement } from 'react'
import { formatEther } from '../utils';
import { AmountInput } from '../components/AmountInput';
import { TokenApproval } from '../components/TokenApproval';
import { InfoCard } from '../components/InfoCard';
import { BuyOnCurve } from '../components/BuyOnCurve';

interface Props {
  readonly sendAmount: bigint,
  readonly ymgpAllowance: bigint,
  readonly ymgpAllowanceCurve: bigint,
  readonly ymgpBalance: bigint,
  readonly ymgpVmgpCurveAmount: bigint,
  readonly onApprove: (_infinity: boolean, _curve: boolean) => Promise<void>
  readonly setSendAmount: (_value: bigint) => void
  readonly depositYMGP: () => Promise<void>
  readonly buyVMGP: () => Promise<void>
}

export const BuyVotesPage = memo(({ sendAmount, ymgpAllowance, ymgpAllowanceCurve, ymgpBalance, ymgpVmgpCurveAmount, onApprove, setSendAmount, depositYMGP, buyVMGP }: Props): ReactElement => {
  return <>
    <div className="rounded-lg">
      <AmountInput label="Get vMGP" token={{ symbol: 'yMGP', color: 'bg-green-400', bgColor: 'bg-green-600' }} balance={ymgpBalance} value={sendAmount} onChange={setSendAmount} />
      <div className="grid grid-cols-1 gap-2 mb-4">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <TokenApproval sendAmount={sendAmount} allowance={ymgpAllowance} onApprove={onApprove} tokenSymbol='yMGP' />
            <button type="submit" className="w-full py-2 rounded-lg transition-colors bg-green-600 hover:bg-green-700 h-min" onClick={() => depositYMGP()}>Mint ({formatEther(sendAmount)} vMGP)</button>
          </div>
          <BuyOnCurve sendAmount={sendAmount} curveAmount={ymgpVmgpCurveAmount} allowanceCurve={ymgpAllowanceCurve} nativeRate={1} onApprove={onApprove} buy={() => buyVMGP()} tokenASymbol='yMGP' tokenBSymbol='vMGP' />
        </div>
      </div>
    </div>
    <InfoCard text="vMGP is backed 1:1 by yMGP. This process can not be undone. vMGP is used to vote on Magpie proposals with Reefi's underlying vlMGP." />
  </>
})
BuyVotesPage.displayName = 'BuyVotesPage'
