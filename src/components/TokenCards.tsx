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
}

export const TokenCards = memo(({ mgpLocked, mgpPrice, mgpSupply, rmgpSupply, ymgpSupply, ymgpLocked, reefiMGPLocked, mgpRmgpCurveRate, rmgpYmgpCurveRate }: Properties): ReactElement => <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
  <TokenCard color="blue" decimals={decimals.MGP} description='MGP is the underlying asset all derivatives rely on.' locked={mgpLocked} price={mgpPrice} supply={mgpSupply} symbol='MGP' />
  <TokenCard color='blue' decimals={decimals.rMGP} description='rMGP earns auto compounding yield from locked MGP, while remaining liquid. rMGP can be converted back to MGP.' marketRate={mgpRmgpCurveRate} supply={rmgpSupply} symbol='rMGP' underlying={reefiMGPLocked} underlyingSymbol='MGP' />
  <TokenCard color='blue' decimals={decimals.yMGP} description='yMGP is backed 1:1 by rMGP but cannot be converted back to rMGP. 5% of protocol yield and withdrawals are distributed to locked yMGP paid in rMGP.' locked={ymgpLocked} marketRate={rmgpYmgpCurveRate} supply={ymgpSupply + ymgpLocked} symbol='yMGP' underlying={ymgpSupply + ymgpLocked} underlyingSymbol='rMGP' />
  {/* <TokenCard symbol='vMGP' decimals={decimals.VMGP} supply={vmgpSupply} marketRate={exchangeRates.curve.ymgpVMGP} voteMultiplier={Number(vmgpSupply ?? 0n)/Number(rmgpSupply ?? 0n)} underlying={vmgpSupply} underlyingSymbol='yMGP' features={{ "Boosted Votes": "Control all of Reefi's vote power" }} description="vMGP is backed 1:1 by yMGP but cannot be converted back to yMGP. vMGP controls all of Reefi's voting power." /> */}
</div>);
TokenCards.displayName = "TokenCards";
