import { memo, type ReactElement } from "react";


export const ConversionRates = memo((): ReactElement => <div className="rounded-xl border border-dashed border-green-700 bg-gray-900/80 p-4">
  <h3 className="mb-2 text-lg font-semibold text-green-400">Developer Tip: Arbitraging Conversion Rates</h3>
  <p className="mb-2 text-sm text-gray-300">rMGP can be minted for an only increasing amount of MGP and burnt for 90% the mint rate with a delay. When the market rate moves out of the mint-rate to burn-rate range, this can be arbitraged.</p>
  <ul className="mb-2 list-inside list-disc text-xs text-gray-400">
    <li>If rMGP becomes cheaper the burn rate, you can buy rMGP and natively burn it. This requires you to wait 60-120 days. <strong>If you don&apos;t want to wait the burn period</strong>, you can indirectly arbitrage by buying rMGP and waiting for others to burn.</li>
    <li>If rMGP becomes more expensive than the mint rate, you can mint rMGP and swap back to MGP.</li>
  </ul>
  <p className="mb-2 list-inside list-disc text-xs text-gray-400">By arbitraging you help tighten the spread by maintaining the 90%-100% peg and increase liquidity through trading volume. This also increases revenue for cMGP holders through swap fees and for locked yMGP holders through withdrawal fees.</p>
  <p className="text-xs text-gray-400">Example: Use <span className="rounded bg-gray-800 px-1 py-0.5 font-mono">Viem</span>, <span className="rounded bg-gray-800 px-1 py-0.5 font-mono">ethers.js</span> or <span className="rounded bg-gray-800 px-1 py-0.5 font-mono">web3.js</span> in a scheduled script to call the contract method and claim your reward automatically.</p>
</div>);
ConversionRates.displayName = "ConversionRates";
