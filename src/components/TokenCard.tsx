import { formatEther, formatNumber } from "../utilities";
import { memo, type ReactElement } from "react";

import { TokenStat } from "./TokenStat";

interface Properties {
  readonly symbol: string;
  readonly decimals: number;
  readonly description: string;
  readonly color: "green" | "blue";
  readonly price?: number;
  readonly supply: bigint;
  readonly locked?: bigint;
  readonly marketRate?: number;
  readonly voteMultiplier?: number;
  readonly underlying?: bigint;
  readonly underlyingSymbol?: string | undefined;
}

export const TokenCard = memo(({ symbol, decimals, description, price, supply, underlying, underlyingSymbol, voteMultiplier, locked, marketRate, color = "green" }: Properties): ReactElement => {
  const bg = `bg-${color}-500`;
  return <div className="rounded-xl border border-gray-700 bg-gray-800 p-2">
    <div className="xl:grid xl:grid-cols-3">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center">
            <div className={`${bg} mr-2 flex size-8 items-center justify-center rounded-full`}>{symbol[0]?.toUpperCase()}</div>
            <p className="text-lg font-bold">${symbol}</p>
          </div>
          {price !== undefined && <h2 className="mt-2 text-2xl font-bold">${price.toFixed(4)}</h2>}
        </div>
      </div>
      <div className="col-span-2 mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:mt-0">
        <TokenStat detail={`${formatNumber(formatEther(supply, decimals), 3)} ${symbol}`} title="Supply" />
        {underlying !== undefined && underlying !== supply && <TokenStat detail={`${formatNumber(formatEther(underlying), 2)} ${underlyingSymbol}`} title="TVL" />}
        {underlying !== undefined && underlying !== supply && <TokenStat detail={`${formatNumber(Number(underlying) / Number(supply), 4)} ${underlyingSymbol}`} title="Mint Rate" />}
        {marketRate !== undefined && <TokenStat detail={`${formatNumber(Number(marketRate), 3)} ${underlyingSymbol}`} title="Market Rate" />}
        {locked !== undefined && <TokenStat detail={`${formatNumber(Math.round(formatEther(locked, decimals)))} ${symbol}`} title="Locked" />}
        {locked !== undefined && <TokenStat detail={`${Math.round(10_000 * Number(locked) / Number(supply)) / 100}%`} title="Lock Rate" />}
        {price !== undefined && <TokenStat detail={`$${formatNumber(price * formatEther(supply, decimals))}`} title="FDV" />}
        {voteMultiplier !== undefined && <TokenStat detail={formatNumber(voteMultiplier)} title="Vote Multiplier" />}
      </div>
    </div>
    <p className="mt-2 text-xs text-gray-400">{description}</p>
  </div>;
});
TokenCard.displayName = "TokenCard";
