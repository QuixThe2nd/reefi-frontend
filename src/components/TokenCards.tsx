import { decimals } from "../config/contracts";
import { memo, type ReactElement } from "react";

import { TokenCard } from "./TokenCard";

interface Properties {
  readonly mgpLocked: bigint;
  readonly mgpPrice: number;
  readonly mgpSupply: bigint;
  readonly rmgpSupply: bigint;
  readonly ymgpSupply: bigint;
  readonly ymgpLocked: bigint;
  readonly reefiMGPLocked: bigint;
  readonly mgpRmgpCurveRate: number;
  readonly rmgpYmgpCurveRate: number;
  readonly ymgpVmgpCurveRate: number;
  readonly vmgpSupply: bigint;
}

export const TokenCards = memo(({ mgpLocked, mgpPrice, mgpSupply, rmgpSupply, ymgpSupply, ymgpLocked, reefiMGPLocked, mgpRmgpCurveRate, rmgpYmgpCurveRate, vmgpSupply, ymgpVmgpCurveRate }: Properties): ReactElement => <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
  <TokenCard decimals={decimals.MGP} description="MGP is the underlying asset all derivatives rely on." locked={mgpLocked} price={mgpPrice} supply={mgpSupply} symbol="MGP" />
  <TokenCard decimals={decimals.wstMGP} description="wstMGP earns auto compounding yield from locked MGP, while remaining liquid. wstMGP can be converted back to MGP." marketRate={mgpRmgpCurveRate} supply={rmgpSupply} symbol="wstMGP" underlying={reefiMGPLocked} underlyingSymbol="MGP" />
  <TokenCard decimals={decimals.yMGP} description="yMGP is backed 1:1 by wstMGP but has a 25% withdraw fee. 5% of vlMGP yield is distributed to locked yMGP paid in wstMGP." locked={ymgpLocked} marketRate={rmgpYmgpCurveRate} supply={ymgpSupply + ymgpLocked} symbol="yMGP" underlying={ymgpSupply + ymgpLocked} underlyingSymbol="wstMGP" />
  <TokenCard decimals={decimals.vMGP} description="vMGP is backed 1:1 by yMGP but cannot be converted back to yMGP. vMGP controls all of Reefi's voting power." marketRate={ymgpVmgpCurveRate} supply={vmgpSupply} symbol="vMGP" underlying={vmgpSupply} underlyingSymbol="yMGP" voteMultiplier={Number(reefiMGPLocked) / Number(vmgpSupply)} />
</div>);
TokenCards.displayName = "TokenCards";
