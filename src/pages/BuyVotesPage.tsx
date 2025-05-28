import { ReactElement } from 'react'
import { formatEther } from '../utils';
import { AmountInput } from '../components/AmountInput';
import { TokenApproval } from '../components/TokenApproval';
import { InfoCard } from '../components/InfoCard';
import { BuyOnCurve } from '../components/BuyOnCurve';

interface Props {
  sendAmount: bigint,
  ymgpAllowance: bigint | undefined,
  ymgpAllowanceCurve: bigint | undefined,
  ymgpBalance: bigint | undefined,
  ymgpVmgpCurveAmount: bigint | undefined,
  onApprove: (_infinity: boolean, _curve: boolean) => Promise<void>
  setSendAmount: (value: bigint) => void
}

export const BuyVotesPage = ({ sendAmount, ymgpAllowance, ymgpAllowanceCurve, ymgpBalance, ymgpVmgpCurveAmount, onApprove, setSendAmount }: Props): ReactElement => {
  return <>
    <div className="bg-gray-700/50 p-5 rounded-lg">
      <AmountInput label="Get vMGP" token={{ symbol: 'yMGP', color: 'bg-green-400', bgColor: 'bg-green-600' }} balance={ymgpBalance} value={sendAmount} onChange={setSendAmount} />
      <div className="grid grid-cols-1 gap-2 mb-4">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <TokenApproval sendAmount={sendAmount} allowance={ymgpAllowance} onApprove={onApprove} tokenSymbol='yMGP' />
            <button type="submit" className="w-full py-3 rounded-lg transition-colors bg-green-600 hover:bg-green-700" onClick={depositYMGP}>Mint ({formatEther(sendAmount)} vMGP)</button>
          </div>
          <BuyOnCurve sendAmount={sendAmount} curveAmount={ymgpVmgpCurveAmount} allowanceCurve={ymgpAllowanceCurve} rate={1} onApprove={onApprove} buy={buyVMGP} tokenASymbol='yMGP' tokenBSymbol='vMGP' />
        </div>
      </div>
    </div>
    <InfoCard text="vMGP is backed 1:1 by yMGP. This process can not be undone. vMGP is used to vote on Magpie proposals with Reefi's underlying vlMGP." />
  </>
}
