import { JSX, ReactElement } from 'react'
import { AmountInput } from '../components/AmountInput';
import { TokenApproval } from '../components/TokenApproval';
import { aprToApy, formatEther } from '../utils';

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
        <div>
          <TokenApproval sendAmount={sendAmount} allowance={mgpAllowanceCurve} onApprove={onApprove} tokenSymbol='MGP' curve={true} />
          <div className="relative">
            <button type="submit" className="w-full py-3 rounded-lg transition-colors bg-green-600 hover:bg-green-700" onClick={buyRMGP}>Buy on Curve ({formatEther(mgpRmgpCurveAmount ?? 0n)} rMGP)</button>
            {mgpRmgpCurveAmount !== undefined && ((): JSX.Element | null => {
              const directRate = formatEther(sendAmount) / mgpRMGPRate;
              const curveRate = formatEther(mgpRmgpCurveAmount);
              const premiumDiscount = ((curveRate - directRate) / directRate) * 100;
              const isPremium = premiumDiscount > 0;
              return Math.abs(premiumDiscount) >= 0.01 ? <span className={`absolute -top-2 right-0 text-xs px-2 py-1 rounded ${isPremium ? 'bg-green-800/80 text-green-200' : 'bg-red-800/80 text-red-200'}`}>{isPremium ? '+' : ''}{premiumDiscount.toFixed(2)}%</span> : null;
            })()}
          </div>
        </div>
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
    <div className="mt-4 bg-indigo-900/20 border border-green-800/30 rounded-lg p-3 text-sm">
      <div className="flex items-start">
        <div className="p-1 bg-indigo-800/30 rounded-full mr-3 mt-0.5"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400"><title>Info</title><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg></div>
        <div>
          <span className="font-medium text-indigo-300">About</span>
          <p className="text-gray-300 mt-1">MGP can be converted to rMGP to earn auto compounded yield. Yield is accrued from vlMGP SubDAO Rewards and half the withdrawal fees.</p>
        </div>
      </div>
    </div>
  </>
}
