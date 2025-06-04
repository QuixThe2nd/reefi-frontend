import { decimals } from "../config/contracts";
import { memo, type ReactElement } from "react";

import { TokenCard } from "./TokenCard";

interface Properties {
  mgpLocked: bigint;
  mgpPrice: number;
  mgpSupply: bigint;
  rmgpSupply: bigint;
  ymgpSupply: bigint;
  ymgpLocked: bigint;
  reefiMGPLocked: bigint;
  mgpRmgpCurveRate: number;
  rmgpYmgpCurveRate: number;
  ymgpVmgpCurveRate: number;
  vmgpSupply: bigint;
}

export const TokenCards = memo(({ mgpLocked, mgpPrice, mgpSupply, rmgpSupply, ymgpSupply, ymgpLocked, reefiMGPLocked, mgpRmgpCurveRate, rmgpYmgpCurveRate, vmgpSupply, ymgpVmgpCurveRate }: Properties): ReactElement => <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
  <TokenCard decimals={decimals.MGP} description='MGP is the underlying asset all derivatives rely on.' locked={mgpLocked} price={mgpPrice} supply={mgpSupply} symbol='MGP' />
  <TokenCard decimals={decimals.rMGP} description='rMGP earns auto compounding yield from locked MGP, while remaining liquid. rMGP can be converted back to MGP.' marketRate={mgpRmgpCurveRate} supply={rmgpSupply} symbol='rMGP' underlying={reefiMGPLocked} underlyingSymbol='MGP' />
  <TokenCard decimals={decimals.yMGP} description='yMGP is backed 1:1 by rMGP but has a 25% withdraw fee. 5% of vlMGP yield is distributed to locked yMGP paid in rMGP.' locked={ymgpLocked} marketRate={rmgpYmgpCurveRate} supply={ymgpSupply + ymgpLocked} symbol='yMGP' underlying={ymgpSupply + ymgpLocked} underlyingSymbol='rMGP' />
  <TokenCard decimals={decimals.vMGP} description="vMGP is backed 1:1 by yMGP but cannot be converted back to yMGP. vMGP controls all of Reefi's voting power." symbol='vMGP' supply={vmgpSupply} marketRate={ymgpVmgpCurveRate} voteMultiplier={Number(reefiMGPLocked) / Number(vmgpSupply)} underlying={vmgpSupply} underlyingSymbol='yMGP' />
</div>);
TokenCards.displayName = "TokenCards";
