import type { ReactElement } from 'react'
import { formatNumber } from '../utils';
import { ExchangeRates } from '../hooks/useExchangeRates'

export const ConversionRates = ({ exchangeRates }: { readonly exchangeRates: ExchangeRates }): ReactElement => {
  return <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 mb-6 flex flex-col items-center">
    <h2 className="text-2xl font-bold mb-4">Conversion Rates</h2>
    <div className="bg-gray-700/50 rounded-lg p-4">
      <table>
        <thead>
          <tr>
            <th><h3 className="text-lg font-bold mb-2"></h3></th>
            <th><h3 className="text-lg font-bold mb-2">Mint</h3></th>
            <th><h3 className="text-lg font-bold mb-2">Market Buy</h3></th>
            <th><h3 className="text-lg font-bold mb-2">Market Sell</h3></th>
            <th><h3 className="text-lg font-bold mb-2">Burn</h3></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><p className="mx-4 my-1 text-sm font-bold">rMGP</p></td>
            <td><p className="mx-4 my-1 text-sm">{formatNumber(exchangeRates.mintRMGP, 4)} MGP</p></td>
            <td><p className="mx-4 my-1 text-sm">{formatNumber(exchangeRates.curve.mgpRMGP, 4)} MGP</p></td>
            <td><p className="mx-4 my-1 text-sm">{formatNumber(exchangeRates.curve.rmgpMGP, 4)} MGP</p></td>
            <td><p className="mx-4 my-1 text-sm">{formatNumber(exchangeRates.mintRMGP*0.9, 4)} MGP</p></td>
          </tr>
          <tr>
            <td><p className="mx-4 my-1 text-sm font-bold">yMGP</p></td>
            <td><p className="mx-4 my-1 text-sm">1 rMGP</p></td>
            <td><p className="mx-4 my-1 text-sm">{formatNumber(exchangeRates.curve.rmgpYMGP, 4)} rMGP</p></td>
            <td><p className="mx-4 my-1 text-sm">{formatNumber(exchangeRates.curve.ymgpRMGP, 4)} rMGP</p></td>
            <td><p className="mx-4 my-1 text-sm">0 rMGP</p></td>
          </tr>
        </tbody>
      </table>
    </div>
    <ul className="text-gray-400 text-xs mt-4">
      <li><span className="font-bold">Mint</span>: The native rate Reefi will fulfill mints at</li>
      <li><span className="font-bold">Market Buy</span>: The rate Curve will fulfill buys at</li>
      <li><span className="font-bold">Market Sell</span>: The rate Curve will fulfill sells at</li>
      <li><span className="font-bold">Burn</span>: The native rate Reefi will fulfill burns at</li>
    </ul>
  </div>
}
