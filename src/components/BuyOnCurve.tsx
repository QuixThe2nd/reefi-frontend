import type { JSX, ReactElement } from 'react'
import { formatEther } from '../utils';
import { TokenApproval } from './TokenApproval';

interface Props {
  sendAmount: bigint
  curveAmount: bigint | undefined
  allowanceCurve: bigint | undefined
  rate: number
  onApprove: (infinity: boolean, curve: boolean) => Promise<void>
  buy: () => void
  tokenASymbol: string
  tokenBSymbol: string
}

export const BuyOnCurve = ({ sendAmount, curveAmount, allowanceCurve, rate, onApprove, buy, tokenASymbol, tokenBSymbol }: Props): ReactElement => {
  return <div>
    <TokenApproval sendAmount={sendAmount} allowance={allowanceCurve} onApprove={onApprove} tokenSymbol={tokenASymbol} curve={true} />
    <div className="relative">
      <button type="submit" className="w-full py-3 rounded-lg transition-colors bg-green-600 hover:bg-green-700" onClick={buy}>Buy on Curve ({formatEther(curveAmount ?? 0n)} {tokenBSymbol})</button>
      {curveAmount !== undefined && ((): JSX.Element | null => {
        const directRate = formatEther(sendAmount) / rate;
        const premiumDiscount = ((formatEther(curveAmount) - directRate) / directRate) * 100;
        const isPremium = premiumDiscount > 0;
        return Math.abs(premiumDiscount) >= 0.01 ? <span className={`absolute -top-2 right-0 text-xs px-2 py-1 rounded ${isPremium ? 'bg-green-800/80 text-green-200' : 'bg-red-800/80 text-red-200'}`}>{isPremium ? '+' : ''}{premiumDiscount.toFixed(2)}%</span> : null;
      })()}
    </div>
  </div>
}