import { memo, type ReactElement } from 'react'

type Yield = {
  readonly asset: string,
  readonly suffix?: '+'
} & ({
  readonly apy: number | 'variable',
  readonly apr?: undefined
} | {
  readonly apr: number | 'variable',
  readonly apy?: undefined
})

type Props = Yield & { readonly breakdown: Yield[] }

export const YieldBadge = memo(({ asset, apy, apr, suffix, breakdown }: Props): ReactElement => {
  const yieldType = apy === undefined ? 'APR' : 'APY'
  const yieldValue = apy ?? apr
  const percentage = Math.round((yieldValue === 'variable' ? 0 : yieldValue)*10_000)/100
  
  return <div 
    className="text-sm bg-gray-700 rounded-lg px-3 py-1 flex items-center relative group cursor-help"
    title={`${asset} ${yieldType}: ${percentage}%${suffix ?? ''}`}
  >
    <div className="w-2 h-2 rounded-full bg-green-400 mr-2" />
    <span>{asset} {yieldType}: {percentage}%{suffix}</span>
    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
      <div className="space-y-1">
        {breakdown.map((item, index) => <div key={index} className="flex justify-between gap-2">
          <span>{item.asset}:</span>
          {item.apy === undefined ? <span>{item.apr === 'variable' ? 'Variable' : `${Math.round(item.apr*10_000)/100}%`} APR</span> : <span>{item.apy === 'variable' ? 'Variable' : `${Math.round(item.apy*10_000)/100}%`} APY</span>}
        </div>)}
      </div>
    </div>
  </div>
})
YieldBadge.displayName = 'YieldBadge'
