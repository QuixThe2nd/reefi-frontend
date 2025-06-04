import { formatEther, formatNumber } from "../utilities";
import { memo, type ReactElement } from "react";

import { Card } from "./Card";
import { Coins, coins } from "../config/contracts";
import { TokenStat } from "./TokenStat";

interface Properties {
  symbol: Coins;
  decimals: number;
  description: string;
  price?: number;
  supply: bigint;
  locked?: bigint;
  marketRate?: number;
  voteMultiplier?: number;
  underlying?: bigint;
  underlyingSymbol?: string;
}

export const TokenCard = memo(({ symbol, decimals, description, price, supply, underlying, underlyingSymbol, voteMultiplier, locked, marketRate }: Properties): ReactElement => <Card padding={4}>
  <div className="xl:grid xl:grid-cols-3 w-full">
    <div className="flex items-start justify-between">
      <div>
        <div className="flex items-center">
          {/* <div className={`${bg} mr-2 flex  items-center justify-center rounded-full`}>{symbol[0]?.toUpperCase()}</div> */}
          <img className="size-8 mr-2" src={coins[symbol].icon} />
          <p className="text-lg font-bold">${symbol}</p>
        </div>
      </div>
    </div>
    <div className="col-span-2 mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:mt-0">
      <TokenStat detail={`${formatNumber(formatEther(supply, decimals), 3)} ${symbol}`} title="Supply" />
      {price !== undefined && <TokenStat detail={`$${price.toFixed(4)}`} title="Price" />}
      {underlying !== undefined && <TokenStat detail={`${formatNumber(formatEther(underlying), 2)} ${underlyingSymbol}`} title="TVL" />}
      {underlying !== undefined && underlying !== supply && <TokenStat detail={`${formatNumber(Number(underlying) / Number(supply), 4)} ${underlyingSymbol}`} title="Mint Rate" />}
      {locked !== undefined && <TokenStat detail={`${String(Math.round(10_000 * Number(locked) / Number(supply)) / 100)}%`} title="Lock Rate" />}
      {price !== undefined && <TokenStat detail={`$${formatNumber(price * formatEther(supply, decimals))}`} title="FDV" />}
      {voteMultiplier !== undefined && <TokenStat detail={`${formatNumber(voteMultiplier)}x`} title="Vote Multiplier" />}
      {marketRate !== undefined && <TokenStat detail={`${formatNumber(100 * (Number(underlying) / Number(supply)) / Number(marketRate), 2)}%`} title="Peg" />}
    </div>
  </div>
  <p className="mt-2 text-xs text-gray-400 w-full">{description}</p>
</Card>);
TokenCard.displayName = "TokenCard";
