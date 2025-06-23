import { coins, decimals, type PrimaryCoin } from "../state/useContracts";
import { formatEther, formatNumber } from "../utilities";
import { memo, type ReactElement } from "react";

import { Card } from "./Card";
import { TokenStat } from "./TokenStat";

interface Properties {
  readonly symbol: PrimaryCoin;
  readonly description: string;
  readonly supply: bigint;
  readonly price?: number;
  readonly locked?: bigint;
  readonly marketRate?: number;
  readonly voteMultiplier?: number;
  readonly underlying?: bigint;
  readonly underlyingSymbol?: string;
}

export const TokenCard = memo(({ symbol, description, price, supply, underlying, underlyingSymbol, voteMultiplier, locked, marketRate }: Properties): ReactElement => <Card padding={4}>
  <div className="w-full">
    {/* <div className={`${bg} mr-2 flex  items-center justify-center rounded-full`}>{symbol[0]?.toUpperCase()}</div> */}
    <div className="flex gap-2 mb-2">
      <img className="size-8" src={coins[symbol].icon} />
      <p className="text-lg font-bold">{symbol}</p>
    </div>
    <p className="mb-2 text-xs text-gray-400 w-full">{description}</p>
    <div className="col-span-2 mt-2 grid grid-cols-1 gap-1 sm:grid-cols-2 xl:mt-0">
      <TokenStat detail={`${formatNumber(formatEther(supply, decimals[symbol]), 6)} ${symbol}`} title="Supply" />
      {price !== undefined && <TokenStat detail={`$${price.toFixed(4)}`} title="Price" />}
      {underlying !== undefined && underlyingSymbol !== undefined && underlying !== supply && <TokenStat detail={`${formatNumber(formatEther(underlying), 6)} ${underlyingSymbol}`} title="TVL" />}
      {underlying !== undefined && underlying !== supply && <TokenStat detail={`${formatNumber(Number(underlying) / Number(supply), 6)} ${underlyingSymbol}`} title="Mint Rate" />}
      {locked !== undefined && <TokenStat detail={`${String(Math.round(10_000 * Number(locked) / Number(supply)) / 100)}%`} title="Lock Rate" />}
      {price !== undefined && <TokenStat detail={`$${formatNumber(price * formatEther(supply, decimals[symbol]))}`} title="FDV" />}
      {voteMultiplier !== undefined && <TokenStat detail={`${formatNumber(voteMultiplier)}x`} title="Vote Multiplier" />}
      {marketRate !== undefined && <TokenStat detail={`${formatNumber(100 * (Number(underlying) / Number(supply)) / Number(marketRate), 2)}%`} title="Peg" />}
    </div>
  </div>
</Card>);
TokenCard.displayName = "TokenCard";
