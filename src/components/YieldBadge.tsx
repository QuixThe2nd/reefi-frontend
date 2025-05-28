import type { ReactElement } from 'react'

export const YieldBadge = ({ asset, apy, apr, suffix }: { readonly asset: string, readonly suffix?: '+' } & ({ readonly apy: number, readonly apr?: undefined } | { readonly apr: number, readonly apy?: undefined })): ReactElement => {
  return <div className="text-sm bg-gray-700 rounded-lg px-3 py-1 flex items-center">
    <div className="w-2 h-2 rounded-full bg-green-400 mr-2" />
    <span>{asset} {apy === undefined ? 'APR' : 'APY'}: {Math.round((apy ?? apr)*10_000)/100}%{suffix}</span>
  </div>
}
