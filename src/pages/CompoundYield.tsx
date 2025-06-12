import { decimals, type SecondaryCoin } from "../config/contracts";
import { formatEther, formatNumber, formatTime } from "../utilities";
import { memo, type ReactElement } from "react";
import { useWriteContract, type UseWriteContractReturnType } from "wagmi";

import { Button } from "../components/Button";
import { Page } from "../components/Page";

import type { usePrices } from "../state/usePrices";
import type { wagmiConfig } from "..";

interface Properties {
  readonly uncompoundedMGPYield: number;
  readonly uncompoundedYMGPYield: number;
  readonly estimatedCompoundGasFee: bigint;
  readonly pendingRewards: Record<SecondaryCoin, { rewards: bigint }>;
  readonly mgpAPR: number;
  readonly prices: ReturnType<typeof usePrices>;
  readonly compoundRMGP: (_writeContract: UseWriteContractReturnType<typeof wagmiConfig>["writeContract"]) => void;
  readonly reefiMGPLocked: bigint;
}

export const CompoundYield = memo(({ uncompoundedMGPYield, uncompoundedYMGPYield, estimatedCompoundGasFee, pendingRewards, mgpAPR, reefiMGPLocked, prices, compoundRMGP }: Properties): ReactElement => {
  const { writeContract } = useWriteContract();
  const estimatedCompoundGasUSD = formatEther(estimatedCompoundGasFee) * prices.ETH;
  const textColor = `text-${uncompoundedMGPYield * prices.MGP * 0.01 > estimatedCompoundGasUSD ? "green" : "red"}-400`;
  return <Page info={<span>Pending yield (PNP, EGP, etc) gets converted to MGP and locked as vlMGP. The underlying backing of wstMGP increases each time yields are compounded. 1% of MGP yield is sent to the compounder as yMGP, 4% sent to the treasury, and 5% to locked yMGP holders. By clicking the compound button, you will receive 1% of the pending yield.</span>} noTopMargin>
    <h3 className="mb-2 font-medium">Uncompounded Yield</h3>
    <div className="rounded-lg bg-gray-700/50 p-4">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-lg font-medium">{formatNumber(uncompoundedMGPYield, 4)} MGP</p>
        <p className="text-lg font-medium">${formatNumber(uncompoundedMGPYield * prices.MGP, 4)}</p>
      </div>
      {(Object.keys(pendingRewards) as SecondaryCoin[]).map(symbol => pendingRewards[symbol].rewards !== 0n ? <div className="flex justify-between" key={symbol}>
        <p className="text-xs">{formatNumber(formatEther(pendingRewards[symbol].rewards, decimals[symbol]), 6)} {symbol}</p>
        <p className="text-xs">{formatNumber(prices[symbol] * Number(formatEther(pendingRewards[symbol].rewards, decimals[symbol])) / prices.MGP, 6)} MGP</p>
      </div> : undefined)}
    </div>
    <Button className="mt-4 w-full" onClick={() => compoundRMGP(writeContract)} type="button">Compound Yield (Get ~{uncompoundedYMGPYield} yMGP)</Button>
    <div className="mt-4 text-sm text-gray-400">
      <div className="mb-1 flex justify-between">
        <span>Estimated Payout</span>
        <span>${formatNumber(uncompoundedMGPYield * prices.MGP * 0.01, 4)}</span>
      </div>
      <div className="mb-1 flex justify-between">
        <span>Estimated Gas Fee</span>
        <span>${formatNumber(estimatedCompoundGasUSD, 4)}</span>
      </div>
      <div className="mb-1 flex justify-between">
        <span>Estimated Profit</span>
        <span className={textColor}>{uncompoundedMGPYield * prices.MGP * 0.01 > estimatedCompoundGasUSD ? "" : "-"}${String(formatNumber(uncompoundedMGPYield * prices.MGP * 0.01 - estimatedCompoundGasUSD, 6)).replace("-", "")}</span>
      </div>
      {uncompoundedMGPYield * prices.MGP * 0.01 < estimatedCompoundGasUSD && <div className="mb-1 flex justify-between">
        <span>ETA Till Profitable</span>
        <span>{formatTime(estimatedCompoundGasUSD / prices.MGP / (formatEther(BigInt(mgpAPR * Number(reefiMGPLocked)), decimals.MGP) / (365 * 24 * 60 * 60)))}</span>
      </div>}
    </div>
  </Page>;
});
CompoundYield.displayName = "CompoundYield";
