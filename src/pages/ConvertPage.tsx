import { ReactElement } from 'react'
import { formatEther } from '../utils';
import { AmountInput } from '../components/AmountInput';
import { TokenApproval } from '../components/TokenApproval';
import { InfoCard } from '../components/InfoCard';
import { BuyOnCurve } from '../components/BuyOnCurve';

interface Props {
  readonly sendAmount: bigint,
  readonly rmgpBalance: bigint,
  readonly rmgpAllowance: bigint,
  readonly rmgpAllowanceCurve: bigint,
  readonly rmgpYmgpCurveAmount: bigint,
  readonly onApprove: (_infinity: boolean, _curve: boolean) => Promise<void>
  readonly setSendAmount: (_value: bigint) => void
  readonly depositRMGP: () => void
  readonly buyYMGP: () => void
}

export const ConvertPage = ({ sendAmount, rmgpBalance, rmgpAllowance, rmgpAllowanceCurve, rmgpYmgpCurveAmount, onApprove, setSendAmount, depositRMGP, buyYMGP }: Props): ReactElement => {
  return <>
    <div className="bg-gray-700/50 p-5 rounded-lg">
      <AmountInput label="Convert rMGP" token={{ symbol: 'rMGP', color: 'bg-green-400', bgColor: 'bg-green-600' }} balance={rmgpBalance} value={sendAmount} onChange={setSendAmount} />
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div>
          <TokenApproval sendAmount={sendAmount} allowance={rmgpAllowance} onApprove={onApprove} tokenSymbol='rMGP' />
          <button type="submit" className="w-full py-3 rounded-lg transition-colors bg-green-600 hover:bg-green-700" onClick={depositRMGP}>Mint ({formatEther(sendAmount)} yMGP)</button>
        </div>
        <BuyOnCurve sendAmount={sendAmount} curveAmount={rmgpYmgpCurveAmount} allowanceCurve={rmgpAllowanceCurve} rate={1} onApprove={onApprove} buy={buyYMGP} tokenASymbol='rMGP' tokenBSymbol='yMGP' />
      </div>
    </div>
    <InfoCard text="yMGP is backed 1:1 by rMGP. This process can not be undone. yMGP alone has no additional benefit over rMGP, it must be locked for boosted yield." />
  </>
}
