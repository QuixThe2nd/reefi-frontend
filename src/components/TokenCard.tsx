import { memo, type ReactElement } from 'react'
import { formatNumber, formatEther } from '../utils'
import { TokenStat } from './TokenStat'

interface Props {
  readonly symbol: string,
  readonly decimals: number,
  readonly description: string,
  readonly price?: number,
  readonly supply: bigint,
  readonly locked?: bigint,
  readonly marketRate?: number,
  readonly voteMultiplier?: number,
  readonly underlying?: bigint,
  readonly underlyingSymbol?: string | undefined,
}

export const TokenCard = memo(({ symbol, decimals, description, price, supply, underlying, underlyingSymbol, voteMultiplier, locked, marketRate }: Props): ReactElement => {
  return <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
    <div className="grid grid-cols-3">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center mr-2">{symbol[0]?.toUpperCase()}</div>
            <p className="font-bold text-lg">${symbol}</p>
          </div>
          {price !== undefined && <h2 className="text-2xl font-bold mt-2">${price.toFixed(5)}</h2>}
        </div>
      </div>
      <div className="grid grid-cols-2 col-span-2 gap-2">
        <TokenStat title="Supply" detail={`${formatNumber(formatEther(supply, decimals), 3)} ${symbol}`} />
        {underlying !== undefined && underlying !== supply && <TokenStat title="TVL" detail={`${formatNumber(formatEther(underlying), 4)} ${underlyingSymbol}`} />}
        {underlying !== undefined && underlying !== supply && <TokenStat title="Mint Rate" detail={`${formatNumber(Number(underlying)/Number(supply), 6)} ${underlyingSymbol}`} />}
        {marketRate !== undefined && <TokenStat title="Market Rate" detail={`${formatNumber(Number(marketRate), 5)} ${underlyingSymbol}`} />}
        {locked !== undefined && <TokenStat title="Locked" detail={`${formatNumber(Math.round(formatEther(locked, decimals)))} ${symbol}`} />}
        {locked !== undefined && <TokenStat title="Lock Rate" detail={`${Math.round(10_000*Number(locked)/Number(supply))/100}%`} />}
        {price !== undefined && <TokenStat title="FDV" detail={`${formatNumber(price*formatEther(supply, decimals))}`} />}
        {voteMultiplier !== undefined && <TokenStat title="Vote Multiplier" detail={`${formatNumber(voteMultiplier)}`} />}
      </div>
    </div>
    <p className="text-gray-400 text-xs mt-2">{description}</p>
  </div>
})
TokenCard.displayName = 'TokenCard'
