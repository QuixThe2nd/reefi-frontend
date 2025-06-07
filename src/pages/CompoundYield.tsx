import { decimals, SecondaryCoin } from "../config/contracts";
import { formatEther, formatNumber, formatTime } from "../utilities";
import { memo, type ReactElement } from "react";
import { usePrices } from "../state/usePrices";

import { Button } from "../components/Button";
import { Page } from "../components/Page";
interface Properties {
  uncompoundedMGPYield: bigint;
  estimatedCompoundGasFee: bigint;
  pendingRewards: Record<SecondaryCoin, { rewards: bigint }>;
  estimatedCompoundAmount: bigint;
  mgpAPR: number;
  prices: ReturnType<typeof usePrices>[0];
  compoundRMGP: () => void;
  reefiMGPLocked: bigint;
}

export const CompoundYield = memo(({ uncompoundedMGPYield, estimatedCompoundGasFee, pendingRewards, estimatedCompoundAmount, mgpAPR, reefiMGPLocked, prices, compoundRMGP }: Properties): ReactElement => {
  const textColor = `text-${formatEther(uncompoundedMGPYield) * prices.MGP * 0.01 > estimatedCompoundGasFee ? "green" : "red"}-400`;
  return <Page info="Pending yield (PNP, EGP, etc) gets converted to MGP and locked as vlMGP. The underlying backing of rMGP increases each time yields are compounded. 1% of MGP yield is sent to the compounder as yMGP, 4% sent to the treasury, and 5% to locked yMGP holders. By clicking the compound button, you will receive 1% of the pending yield." noTopMargin={true}>
    <h3 className="mb-2 font-medium">Uncompounded Yield</h3>
    <div className="rounded-lg bg-gray-700/50 p-2">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-lg font-medium">{formatNumber(formatEther(uncompoundedMGPYield), 4)} MGP</p>
        <p className="text-lg font-medium">${formatNumber(formatEther(uncompoundedMGPYield) * prices.MGP, 4)}</p>
      </div>
      {(Object.keys(pendingRewards) as SecondaryCoin[]).map(symbol => <div className="flex justify-between" key={symbol}>
        <p className="text-xs">{formatNumber(formatEther(pendingRewards[symbol].rewards, decimals[symbol]), 4)} {symbol}</p>
        <p className="text-xs">{formatNumber(prices[symbol] * Number(formatEther(pendingRewards[symbol].rewards, decimals[symbol])) / prices.MGP, 4)} MGP</p>
      </div>)}
    </div>
    <Button className="mt-4 w-full" onClick={compoundRMGP} type="button">Compound Yield (Get ~{Number(estimatedCompoundAmount) / 100} yMGP)</Button>
    <div className="mt-4 text-sm text-gray-400">
      <div className="mb-1 flex justify-between">
        <span>Estimated Payout</span>
        <span>${formatNumber(formatEther(uncompoundedMGPYield) * prices.MGP * 0.01, 4)}</span>
      </div>
      <div className="mb-1 flex justify-between">
        <span>Estimated Gas Fee</span>
        <span>${formatNumber(formatEther(estimatedCompoundGasFee), 4)}</span>
      </div>
      <div className="mb-1 flex justify-between">
        <span>Estimated Profit</span>
        <span className={textColor}>{formatEther(uncompoundedMGPYield) * prices.MGP * 0.01 > estimatedCompoundGasFee ? "" : "-"}${String(formatNumber(formatEther(uncompoundedMGPYield) * prices.MGP * 0.01 - formatEther(estimatedCompoundGasFee), 6)).replace("-", "")}</span>
      </div>
      {formatEther(uncompoundedMGPYield) * prices.MGP * 0.01 < estimatedCompoundGasFee && <div className="mb-1 flex justify-between">
        <span>ETA Till Profitable</span>
        <span>{formatTime(formatEther(estimatedCompoundGasFee) / prices.MGP / (formatEther(BigInt(mgpAPR * Number(reefiMGPLocked)), decimals.MGP) / (365 * 24 * 60 * 60)))}</span>
      </div>}
    </div>
  </Page>;
});
CompoundYield.displayName = "CompoundYield";
