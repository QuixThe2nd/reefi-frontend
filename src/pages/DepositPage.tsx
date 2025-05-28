import { ReactElement } from 'react'
import { AmountInput } from '../components/AmountInput';
import { TokenApproval } from '../components/TokenApproval';
import { aprToApy, formatEther } from '../utils';
import { InfoCard } from '../components/InfoCard';
import { BuyOnCurve } from '../components/BuyOnCurve';

interface Props {
  sendAmount: bigint,
  mgpAllowance: bigint | undefined,
  mgpBalance: bigint | undefined,
  mgpAllowanceCurve: bigint | undefined,
  mgpRmgpCurveAmount: bigint | undefined,
  mgpRMGPRate: number,
  mgpAPR: number,
  onApprove: (infinity: boolean, curve: boolean) => Promise<void>
  setSendAmount: (value: bigint) => void
  depositMGP: () => void
  buyRMGP: () => void
}

export const DepositPage = ({ sendAmount, mgpAllowance, mgpBalance, mgpAllowanceCurve, mgpRmgpCurveAmount, mgpRMGPRate, mgpAPR, onApprove, setSendAmount, depositMGP, buyRMGP }: Props): ReactElement => {
  return <>
    <div className="bg-gray-700/50 p-5 rounded-lg">
      <AmountInput label="Deposit MGP" token={{ symbol: 'MGP', color: 'bg-blue-400', bgColor: 'bg-blue-600' }} balance={mgpBalance} value={sendAmount} onChange={setSendAmount} />
      <div className="grid grid-cols-2 gap-2">
        <div>
          <TokenApproval sendAmount={sendAmount} allowance={mgpAllowance} onApprove={onApprove} tokenSymbol='MGP' />
          <button type="submit" className="py-3 rounded-lg transition-colors bg-green-600 hover:bg-green-700 w-full" onClick={depositMGP}>Mint ({formatEther(sendAmount) / mgpRMGPRate} rMGP)</button>
        </div>
        <BuyOnCurve sendAmount={sendAmount} curveAmount={mgpRmgpCurveAmount} allowanceCurve={mgpAllowanceCurve} rate={mgpRMGPRate} onApprove={onApprove} buy={buyRMGP} tokenASymbol='MGP' tokenBSymbol='rMGP' />
      </div>
      <div className="mt-4 text-sm text-gray-400">
        <div className="flex justify-between mb-1">
          <span>Original APR</span>
          <span>{Math.round(10_000*mgpAPR)/100}%</span>
        </div>
        <div className="flex justify-between mb-1">
          <span>Reward APY</span>
          <span>{Math.round(10_000*aprToApy(mgpAPR)*0.9)/100}%</span>
        </div>
      </div>
    </div>
    <InfoCard text="MGP can be converted to rMGP to earn auto compounded yield. Yield is accrued from vlMGP SubDAO Rewards and half the withdrawal fees." />
  </>
}
