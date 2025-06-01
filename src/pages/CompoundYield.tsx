import { contracts, decimals, type Coins } from "../config/contracts";
import { formatEther, formatNumber, formatTime } from "../utilities";
import { memo, type ReactElement } from "react";
import { useGlobalContext } from "../contexts/GlobalContext";

import { Page } from "../components/Page";

export const CompoundYield = memo((): ReactElement => {
  const { actions, locked, prices, rewards, wallet } = useGlobalContext();
  const textColor = `text-${rewards.uncompoundedMGPYield * prices.MGP * 0.01 > rewards.estimatedCompoundGasFee ? "green" : "red"}-400`;
  return <Page info="Pending yield (PNP, EGP, etc) gets converted to MGP and locked as vlMGP. The underlying backing of rMGP increases each time yields are compounded. 1% of MGP yield is sent to the compounder as yMGP, 4% sent to the treasury, and 5% to locked yMGP holders. By clicking the button below, you will receive 1% of the pending yield.">
    <h3 className="mb-1 font-medium">Uncompounded Yield</h3>
    <div className="rounded-lg bg-gray-700/50 p-2">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-lg font-medium">{formatNumber(rewards.uncompoundedMGPYield, 4)} MGP</p>
        <p className="text-lg font-medium">${formatNumber(rewards.uncompoundedMGPYield * prices.MGP, 4)}</p>
      </div>
      {(Object.keys(rewards.pendingRewards) as Coins[]).map(symbol => <div className="flex justify-between" key={symbol}>
        <p className="text-xs">{formatNumber(formatEther(rewards.pendingRewards[symbol].rewards, decimals[symbol]), 4)} {symbol}</p>
        <p className="text-xs">{formatNumber(prices[symbol] * Number(formatEther(rewards.pendingRewards[symbol].rewards, decimals[symbol])) / prices.MGP, 4)} MGP</p>
      </div>)}
    </div>
    <button className="mt-4 w-full rounded-lg bg-green-600 py-3 transition-colors hover:bg-green-700" onClick={actions.compoundRMGP} type="button">Compound Yield (Get ~{Number(rewards.estimatedCompoundAmount[0] ?? 0n) / 100} yMGP)</button>
    <div className="mt-4 text-sm text-gray-400">
      <div className="mb-1 flex justify-between">
        <span>Estimated Payout</span>
        <span>${formatNumber(rewards.uncompoundedMGPYield * prices.MGP * 0.01, 4)}</span>
      </div>
      <div className="mb-1 flex justify-between">
        <span>Estimated Gas Fee</span>
        <span>${formatNumber(rewards.estimatedCompoundGasFee, 4)}</span>
      </div>
      <div className="mb-1 flex justify-between">
        <span>Estimated Profit</span>
        <span className={textColor}>{rewards.uncompoundedMGPYield * prices.MGP * 0.01 > rewards.estimatedCompoundGasFee ? "" : "-"}${String(formatNumber(rewards.uncompoundedMGPYield * prices.MGP * 0.01 - rewards.estimatedCompoundGasFee, 6)).replace("-", "")}</span>
      </div>
      {rewards.uncompoundedMGPYield * prices.MGP * 0.01 < rewards.estimatedCompoundGasFee && <div className="mb-1 flex justify-between">
        <span>ETA Till Profitable</span>
        <span>{formatTime(rewards.estimatedCompoundGasFee / prices.MGP / (formatEther(BigInt(rewards.mgpAPR * Number(locked.reefiMGP)), decimals.MGP) / (365 * 24 * 60 * 60)))}</span>
      </div>}
    </div>
    <div className="mt-6 rounded-xl border border-dashed border-green-700 bg-gray-900/80 p-4">
      <h3 className="mb-2 text-lg font-semibold text-green-400">Developer Tip: Automate Compounding for Free Money</h3>
      <p className="mb-2 text-sm text-gray-300">Compounding vlMGP yield is critical to Reefi&apos;s function. Anyone can trigger a compound, which compounds everyone&apos;s pending yield. By doing so, you receive 1% of all pending yield. You can automate this process and earn rewards with no investment.</p>
      <ul className="mb-2 list-inside list-disc text-xs text-gray-400">
        <li>Monitor the estimated profit and gas fee.</li>
        <li>Trigger compounding when profit exceeds gas cost by calling <span className="rounded bg-gray-800 px-1 py-0.5 font-mono">{contracts[wallet.chain].rMGP.address}.claim()</span> whenever rewards are higher than gas fees.</li>
        <li>This can be done using free cloud functions, GitHub Actions, or a serverless cron job.</li>
      </ul>
      <p className="text-xs text-gray-400">Example: Use <span className="rounded bg-gray-800 px-1 py-0.5 font-mono">Viem</span>, <span className="rounded bg-gray-800 px-1 py-0.5 font-mono">ethers.js</span> or <span className="rounded bg-gray-800 px-1 py-0.5 font-mono">web3.js</span> in a scheduled script to call the contract method and claim your reward automatically.</p>
    </div>
  </Page>;
});
CompoundYield.displayName = "CompoundYield";
