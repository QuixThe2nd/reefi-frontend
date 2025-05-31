import { memo, type JSX, type ReactElement } from 'react'
import { formatEther } from '../utils';
import { TokenApproval } from './TokenApproval';

interface Props {
  readonly sendAmount: bigint
  readonly curveAmount: bigint
  readonly allowanceCurve: bigint
  readonly nativeRate: number
  readonly onApprove: (_infinity: boolean) => void
  readonly buy: () => void
  readonly tokenASymbol: string
  readonly tokenBSymbol: string
}

export const BuyOnCurve = memo(({ sendAmount, curveAmount, allowanceCurve, nativeRate, onApprove, buy, tokenASymbol, tokenBSymbol }: Props): ReactElement => {
  return <div>
    <TokenApproval sendAmount={sendAmount} allowance={allowanceCurve} onApprove={onApprove} tokenSymbol={tokenASymbol} curve={true} />
    <div className="relative">
      <button type="submit" className="w-full py-2 rounded-lg transition-colors bg-green-600 hover:bg-green-700 h-min text-xs md:text-md" onClick={buy}>Buy on Curve ({formatEther(curveAmount).toFixed(4)} {tokenBSymbol})</button>
      {((): JSX.Element | undefined => {
        const directRate = formatEther(sendAmount) * nativeRate;
        const premiumDiscount = ((formatEther(curveAmount) - directRate) / directRate) * 100;
        const isPremium = premiumDiscount > 0;
        return Math.abs(premiumDiscount) >= 0.01 ? <span className={`absolute text-xs md:text-md -top-4 md:-top-2 right-2 text-xs px-2 py-1 rounded ${isPremium ? 'bg-green-800/80 text-green-200' : 'bg-red-800/80 text-red-200'}`}>{isPremium ? '+' : ''}{premiumDiscount.toFixed(2)}%</span> : undefined;
      })()}
    </div>
  </div>
})
BuyOnCurve.displayName = 'BuyOnCurve'
