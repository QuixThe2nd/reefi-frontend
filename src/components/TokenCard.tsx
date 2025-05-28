import type { ReactElement } from 'react'
import { formatNumber, formatEther } from '../utils'

interface Props {
  readonly symbol: string,
  readonly decimals: number,
  readonly description: string,
  readonly features?: Readonly<Record<string, string>>,
  readonly price?: number,
  readonly supply: bigint,
  readonly locked?: bigint,
  readonly marketRate?: number,
  readonly voteMultiplier?: number,
  readonly underlying?: bigint,
  readonly underlyingSymbol?: string | undefined,
}

export const TokenCard = ({ symbol, decimals, description, features, price, supply, underlying, underlyingSymbol, voteMultiplier, locked, marketRate }: Props): ReactElement => {
  return <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
    <div className="grid grid-cols-3">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center mr-2">{symbol[0]?.toUpperCase()}</div>
            <p className="font-bold text-lg">${symbol}</p>
          </div>
          {price !== undefined ? <h2 className="text-2xl font-bold mt-2">${price.toFixed(5)}</h2> : ''}
        </div>
      </div>
      <div className="grid grid-cols-2 col-span-2 gap-2">
        <div className="bg-gray-700/50 rounded-lg p-2">
          <p className="text-gray-400 text-xs">Supply</p>
          <p className="font-medium">{formatNumber(formatEther(supply, decimals), 3)} {symbol}</p>
        </div>
        {underlying !== undefined && underlying !== supply ? <div className="bg-gray-700/50 rounded-lg p-2">
          <p className="text-gray-400 text-xs">TVL</p>
          <p className="font-medium">{formatNumber(formatEther(underlying), 4)} {underlyingSymbol}</p>
        </div> : ''}
        {underlying !== undefined && underlying !== supply ? <div className="bg-gray-700/50 rounded-lg p-2">
          <p className="text-gray-400 text-xs">Mint Rate</p>
          <p className="font-medium">{formatNumber(Number(underlying)/Number(supply), 6)} {underlyingSymbol}</p>
        </div> : ''}
        {marketRate !== undefined ? <div className="bg-gray-700/50 rounded-lg p-2">
          <p className="text-gray-400 text-xs">Market Rate</p>
          <p className="font-medium">{formatNumber(Number(marketRate), 5)} {underlyingSymbol}</p>
        </div> : ''}
        {locked !== undefined ? <div className="bg-gray-700/50 rounded-lg p-2">
          <p className="text-gray-400 text-xs">Locked</p>
          <p className="font-medium">{formatNumber(Math.round(formatEther(locked, decimals)))} {symbol}</p>
        </div> : ''}
        {locked !== undefined ? <div className="bg-gray-700/50 rounded-lg p-2">
          <p className="text-gray-400 text-xs">Lock Rate</p>
          <p className="font-medium">{Math.round(10_000*Number(locked)/Number(supply))/100}%</p>
        </div> : ''}
        {price !== undefined ? <div className="bg-gray-700/50 rounded-lg p-2">
          <p className="text-gray-400 text-xs">FDV</p>
          <p className="font-medium">${formatNumber(price*formatEther(supply, decimals))}</p>
        </div> : ''}
        {voteMultiplier !== undefined ? <div className="bg-gray-700/50 rounded-lg p-2">
          <p className="text-gray-400 text-xs">Vote Multiplier</p>
          <p className="font-medium">{formatNumber(voteMultiplier)}</p>
        </div> : ''}
      </div>
    </div>
    <p className="text-gray-400 text-xs mt-2">{description}</p>
    <ul className="list-disc list-inside text-gray-300 text-xs mt-2">
      {features ? Object.entries(features).map((feature: readonly [string, string]) => <li key={feature[0]}><strong>{feature[0]}</strong>: {feature[1]}</li>) : ''}
    </ul>
  </div>
}
