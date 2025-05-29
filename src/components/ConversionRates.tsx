import { memo, type ReactElement } from 'react'
import { formatNumber } from '../utils';
import { useGlobalContext } from '../contexts/GlobalContext';

export const ConversionRates = memo((): ReactElement => {
  const { exchangeRates } = useGlobalContext()
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
    <div className="mt-6 bg-gray-900/80 rounded-xl p-4 border border-dashed border-green-700">
      <h3 className="text-lg font-semibold mb-2 text-green-400">Developer Tip: Arbitraging Conversion Rates</h3>
      <p className="text-gray-300 text-sm mb-2">rMGP can be minted for an only increasing amount of MGP and burnt for 90% the mint rate with a delay. When the market rate moves out of the mint-rate to burn-rate range, this can be arbitraged.</p>
      <ul className="list-disc list-inside text-gray-400 text-xs mb-2">
        <li>If rMGP becomes cheaper the burn rate, you can buy rMGP and natively burn it. This requires you to wait 60-120 days. <strong>If you aren&apos;t willing to wait the burn period</strong>, you can still indirectly arbitrage this by simply buying rMGP and waiting for others to burn.</li>
        <li>If rMGP becomes more expensive than the mint rate, you can mint rMGP and swap back to MGP.</li>
      </ul>
      <p className="list-disc list-inside text-gray-400 text-xs mb-2">By arbitraging you help tighten the spread by maintaining the 90%-100% peg and increase liquidity through trading volume. This also increases revenue for cMGP holders through swap fees and for locked yMGP holders through withdrawal fees.</p>
      <p className="text-gray-400 text-xs">
        Example: Use <span className="font-mono bg-gray-800 px-1 py-0.5 rounded">Viem</span>, <span className="font-mono bg-gray-800 px-1 py-0.5 rounded">ethers.js</span> or <span className="font-mono bg-gray-800 px-1 py-0.5 rounded">web3.js</span> in a scheduled script to call the contract method and claim your reward automatically.
      </p>
    </div>
  </div>
})
ConversionRates.displayName = 'ConversionRates'
