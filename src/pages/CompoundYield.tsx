import { formatEther, formatNumber, formatTime } from "../utilities";
import { memo, type ReactElement } from "react";

import { Chains, contracts, decimals, type Coins } from "../config/contracts";
import { Page } from "../components/Page";
import { UsePrices } from "../hooks/usePrices";
import { Button } from "../components/Button";
interface Properties {
  uncompoundedMGPYield: number;
  estimatedCompoundGasFee: number;
  pendingRewards: Record<Coins, { rewards: bigint }>;
  estimatedCompoundAmount: [bigint | undefined, () => void];
  mgpAPR: number;
  chain: Chains;
  prices: UsePrices;
  compoundRMGP: () => void;
  reefiMGPLocked: bigint;
}

export const CompoundYield = memo(({ uncompoundedMGPYield, estimatedCompoundGasFee, pendingRewards, estimatedCompoundAmount, mgpAPR, reefiMGPLocked, chain, prices, compoundRMGP }: Properties): ReactElement => {
  const textColor = `text-${uncompoundedMGPYield * prices.MGP * 0.01 > estimatedCompoundGasFee ? "green" : "red"}-400`;
  return <Page info="Pending yield (PNP, EGP, etc) gets converted to MGP and locked as vlMGP. The underlying backing of rMGP increases each time yields are compounded. 1% of MGP yield is sent to the compounder as yMGP, 4% sent to the treasury, and 5% to locked yMGP holders. By clicking the button below, you will receive 1% of the pending yield.">
    <h3 className="mb-2 font-medium">Uncompounded Yield</h3>
    <div className="rounded-lg bg-gray-700/50 p-2">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-lg font-medium">{formatNumber(uncompoundedMGPYield, 4)} MGP</p>
        <p className="text-lg font-medium">${formatNumber(uncompoundedMGPYield * prices.MGP, 4)}</p>
      </div>
      {(Object.keys(pendingRewards) as Coins[]).map(symbol => <div className="flex justify-between" key={symbol}>
        <p className="text-xs">{formatNumber(formatEther(pendingRewards[symbol].rewards, decimals[symbol]), 4)} {symbol}</p>
        <p className="text-xs">{formatNumber(prices[symbol] * Number(formatEther(pendingRewards[symbol].rewards, decimals[symbol])) / prices.MGP, 4)} MGP</p>
      </div>)}
    </div>
    <Button className="mt-4 w-full" onClick={compoundRMGP} type="button">Compound Yield (Get ~{Number(estimatedCompoundAmount[0] ?? 0n) / 100} yMGP)</Button>
    <div className="mt-4 text-sm text-gray-400">
      <div className="mb-1 flex justify-between">
        <span>Estimated Payout</span>
        <span>${formatNumber(uncompoundedMGPYield * prices.MGP * 0.01, 4)}</span>
      </div>
      <div className="mb-1 flex justify-between">
        <span>Estimated Gas Fee</span>
        <span>${formatNumber(estimatedCompoundGasFee, 4)}</span>
      </div>
      <div className="mb-1 flex justify-between">
        <span>Estimated Profit</span>
        <span className={textColor}>{uncompoundedMGPYield * prices.MGP * 0.01 > estimatedCompoundGasFee ? "" : "-"}${String(formatNumber(uncompoundedMGPYield * prices.MGP * 0.01 - estimatedCompoundGasFee, 6)).replace("-", "")}</span>
      </div>
      {uncompoundedMGPYield * prices.MGP * 0.01 < estimatedCompoundGasFee && <div className="mb-1 flex justify-between">
        <span>ETA Till Profitable</span>
        <span>{formatTime(estimatedCompoundGasFee / prices.MGP / (formatEther(BigInt(mgpAPR * Number(reefiMGPLocked)), decimals.MGP) / (365 * 24 * 60 * 60)))}</span>
      </div>}
    </div>
    <div className="mt-6 rounded-xl border border-dashed border-green-700 bg-gray-900/80 p-4">
      <h3 className="mb-2 text-lg font-semibold text-green-400">Developer Tip: Automate Compounding for Free Money</h3>
      <p className="mb-2 text-sm text-gray-300">Compounding vlMGP yield is critical to Reefi&apos;s function. Anyone can trigger a compound, which compounds everyone&apos;s pending yield. By doing so, you receive 1% of all pending yield. You can automate this process and earn rewards with no investment.</p>
      <ul className="mb-2 list-inside list-disc text-xs text-gray-400">
        <li>Monitor the estimated profit and gas fee.</li>
        <li>Trigger compounding when profit exceeds gas cost by calling <span className="rounded bg-gray-800 px-1 py-0.5 font-mono">{contracts[chain].rMGP.address}.claim()</span> whenever rewards are higher than gas fees.</li>
        <li>This can be done using free cloud functions, GitHub Actions, or a serverless cron job.</li>
      </ul>
      <p className="text-xs text-gray-400">Example: Use <span className="rounded bg-gray-800 px-1 py-0.5 font-mono">Viem</span>, <span className="rounded bg-gray-800 px-1 py-0.5 font-mono">ethers.js</span> or <span className="rounded bg-gray-800 px-1 py-0.5 font-mono">web3.js</span> in a scheduled script to call the contract method and claim your reward automatically.</p>
    </div>
  </Page>;
});
CompoundYield.displayName = "CompoundYield";
