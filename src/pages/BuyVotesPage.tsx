import { JSX, ReactElement } from 'react'
import { formatEther } from '../utils';
import { AmountInput } from '../components/AmountInput';
import { TokenApproval } from '../components/TokenApproval';

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
          <div>
            <TokenApproval sendAmount={sendAmount} allowance={ymgpAllowanceCurve} onApprove={onApprove} tokenSymbol='yMGP' curve={true} />
            <div className="relative">
              <button type="submit" className="w-full py-3 rounded-lg transition-colors bg-green-600 hover:bg-green-700" onClick={buyVMGP}>Buy on Curve ({formatEther(ymgpVmgpCurveAmount ?? 0n)} yMGP)</button>
              {ymgpVmgpCurveAmount !== undefined && ((): JSX.Element | null => {
                const directRate = formatEther(sendAmount);
                const curveRate = formatEther(ymgpVmgpCurveAmount);
                const premiumDiscount = ((curveRate - directRate) / directRate) * 100;
                const isPremium = premiumDiscount > 0;
                return Math.abs(premiumDiscount) >= 0.01 ? <span className={`absolute -top-2 right-0 text-xs px-2 py-1 rounded ${isPremium ? 'bg-green-800/80 text-green-200' : 'bg-red-800/80 text-red-200'}`}>{isPremium ? '+' : ''}{premiumDiscount.toFixed(2)}%</span> : null;
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="mt-4 bg-indigo-900/20 border border-green-800/30 rounded-lg p-3 text-sm">
      <div className="flex items-start">
        <div className="p-1 bg-indigo-800/30 rounded-full mr-3 mt-0.5"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400"><title>Info</title><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg></div>
        <div>
          <span className="font-medium text-indigo-300">About</span>
          <p className="text-gray-300 mt-1">vMGP is backed 1:1 by yMGP. This process can not be undone. vMGP is used to vote on Magpie proposals with Reefi&apos;s underlying vlMGP.</p>
        </div>
      </div>
    </div>
  </>
}
