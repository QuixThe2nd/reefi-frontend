import type { ReactElement } from 'react'
import { formatNumber } from '../utils'

export const ConversionRates = ({ mgpRMGPRate, realMgpRmgpCurveRate, mgpRMGPCurveRate, realRmgpYmgpCurveRate, rmgpYMGPCurveRate }: { mgpRMGPRate: number, realMgpRmgpCurveRate: number, mgpRMGPCurveRate: number | undefined, realRmgpYmgpCurveRate: number, rmgpYMGPCurveRate: number | undefined }): ReactElement => {
  return <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 mb-6 flex flex-col items-center">
    <h2 className="text-2xl font-bold mb-4">Conversion Rates</h2>
    <div className="bg-gray-700/50 rounded-lg p-4">
      <table>
        <thead>
          <tr>
            <th><h3 className="text-lg font-bold mb-2"></h3></th>
            <th><h3 className="text-lg font-bold mb-2">Mint</h3></th>
            <th><h3 className="text-lg font-bold mb-2">Market</h3></th>
            <th><h3 className="text-lg font-bold mb-2">Liquidity</h3></th>
            <th><h3 className="text-lg font-bold mb-2">Burn</h3></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><p className="mx-4 my-1 text-sm font-bold">rMGP</p></td>
            <td><p className="mx-4 my-1 text-sm">{formatNumber(mgpRMGPRate, 4)} MGP</p></td>
            <td><p className="mx-4 my-1 text-sm">{formatNumber(realMgpRmgpCurveRate, 4)} MGP</p></td>
            <td><p className="mx-4 my-1 text-sm">{formatNumber(mgpRMGPCurveRate ?? 0, 4)} MGP</p></td>
            <td><p className="mx-4 my-1 text-sm">{formatNumber(mgpRMGPRate*0.9, 4)} MGP</p></td>
          </tr>
          <tr>
            <td><p className="mx-4 my-1 text-sm font-bold">yMGP</p></td>
            <td><p className="mx-4 my-1 text-sm">1 rMGP</p></td>
            <td><p className="mx-4 my-1 text-sm">{formatNumber(realRmgpYmgpCurveRate, 4)} rMGP</p></td>
            <td><p className="mx-4 my-1 text-sm">{formatNumber(rmgpYMGPCurveRate ?? 0, 4)} rMGP</p></td>
            <td><p className="mx-4 my-1 text-sm">0 rMGP</p></td>
          </tr>
        </tbody>
      </table>
    </div>
    <ul className="text-gray-400 text-xs mt-4">
      <li><span className="font-bold">Mint</span>: The native rate Reefi will fulfill mints at</li>
      <li><span className="font-bold">Market</span>: The rate Curve will fulfill swaps at</li>
      <li><span className="font-bold">Liquidity</span>: The ratio of liquidity provided to Curve</li>
      <li><span className="font-bold">Burn</span>: The native rate Reefi will fulfill burns at</li>
    </ul>
  </div>
}
