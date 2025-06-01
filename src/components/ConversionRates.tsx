import { formatNumber } from "../utilities";
import { memo, type ReactElement } from "react";
import { useGlobalContext } from "../contexts/GlobalContext";

export const ConversionRates = memo((): ReactElement => {
  const { exchangeRates } = useGlobalContext();
  return <div className="flex flex-col items-center rounded-xl border border-gray-700 bg-gray-800 p-3">
    <div className="flex w-full max-w-2xl flex-col items-center">
      <h2 className="mb-4 text-2xl font-bold">Conversion Rates</h2>
      <div className="rounded-lg bg-gray-700/50 p-1 sm:p-4">
        <table>
          <thead>
            <tr>
              <th><h3 className="mb-2 text-lg font-bold" /></th>
              <th><h3 className="mb-2 text-lg font-bold">Mint</h3></th>
              <th><h3 className="mb-2 text-lg font-bold">Market Buy</h3></th>
              <th><h3 className="mb-2 text-lg font-bold">Market Sell</h3></th>
              <th><h3 className="mb-2 text-lg font-bold">Burn</h3></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><p className="mx-2 my-1 text-sm font-bold sm:mx-4">rMGP</p></td>
              <td><p className="mx-2 my-1 text-sm sm:mx-4">{formatNumber(exchangeRates.mintRMGP, 4)} MGP</p></td>
              <td><p className="mx-2 my-1 text-sm sm:mx-4">{formatNumber(exchangeRates.curve.mgpRMGP, 4)} MGP</p></td>
              <td><p className="mx-2 my-1 text-sm sm:mx-4">{formatNumber(exchangeRates.curve.rmgpMGP, 4)} MGP</p></td>
              <td><p className="mx-2 my-1 text-sm sm:mx-4">{formatNumber(exchangeRates.mintRMGP * 0.9, 4)} MGP</p></td>
            </tr>
            <tr>
              <td><p className="mx-2 my-1 text-sm font-bold sm:mx-4">yMGP</p></td>
              <td><p className="mx-2 my-1 text-sm sm:mx-4">1 rMGP</p></td>
              <td><p className="mx-2 my-1 text-sm sm:mx-4">{formatNumber(exchangeRates.curve.rmgpYMGP, 4)} rMGP</p></td>
              <td><p className="mx-2 my-1 text-sm sm:mx-4">{formatNumber(exchangeRates.curve.ymgpRMGP, 4)} rMGP</p></td>
              <td><p className="mx-2 my-1 text-sm sm:mx-4">0 rMGP</p></td>
            </tr>
          </tbody>
        </table>
      </div>
      <ul className="mt-4 text-xs text-gray-400">
        <li><span className="font-bold">Mint</span>: The native rate Reefi will fulfill mints at</li>
        <li><span className="font-bold">Market Buy</span>: The rate Curve will fulfill buys at</li>
        <li><span className="font-bold">Market Sell</span>: The rate Curve will fulfill sells at</li>
        <li><span className="font-bold">Burn</span>: The native rate Reefi will fulfill burns at</li>
      </ul>
      <div className="mt-6 rounded-xl border border-dashed border-green-700 bg-gray-900/80 p-4">
        <h3 className="mb-2 text-lg font-semibold text-green-400">Developer Tip: Arbitraging Conversion Rates</h3>
        <p className="mb-2 text-sm text-gray-300">rMGP can be minted for an only increasing amount of MGP and burnt for 90% the mint rate with a delay. When the market rate moves out of the mint-rate to burn-rate range, this can be arbitraged.</p>
        <ul className="mb-2 list-inside list-disc text-xs text-gray-400">
          <li>If rMGP becomes cheaper the burn rate, you can buy rMGP and natively burn it. This requires you to wait 60-120 days. <strong>If you don&apos;t want to wait the burn period</strong>, you can indirectly arbitrage by buying rMGP and waiting for others to burn.</li>
          <li>If rMGP becomes more expensive than the mint rate, you can mint rMGP and swap back to MGP.</li>
        </ul>
        <p className="mb-2 list-inside list-disc text-xs text-gray-400">By arbitraging you help tighten the spread by maintaining the 90%-100% peg and increase liquidity through trading volume. This also increases revenue for cMGP holders through swap fees and for locked yMGP holders through withdrawal fees.</p>
        <p className="text-xs text-gray-400">Example: Use <span className="rounded bg-gray-800 px-1 py-0.5 font-mono">Viem</span>, <span className="rounded bg-gray-800 px-1 py-0.5 font-mono">ethers.js</span> or <span className="rounded bg-gray-800 px-1 py-0.5 font-mono">web3.js</span> in a scheduled script to call the contract method and claim your reward automatically.</p>
      </div>
    </div>
  </div>;
});
ConversionRates.displayName = "ConversionRates";
