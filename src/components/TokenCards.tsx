import { decimals } from "../config/contracts";
import { memo, type ReactElement } from "react";
import { useGlobalContext } from "../contexts/GlobalContext";

import { TokenCard } from "./TokenCard";

export const TokenCards = memo((): ReactElement => {
  const { prices, supplies, locked, exchangeRates } = useGlobalContext();
  return <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
    <TokenCard color="blue" decimals={decimals.MGP} description='MGP is the underlying asset all derivatives rely on.' locked={locked.mgp} price={prices.MGP} supply={supplies.mgp} symbol='MGP' />
    <TokenCard color='green' decimals={decimals.rMGP} description='rMGP earns auto compounding yield from locked MGP, while remaining liquid. rMGP can be converted back to MGP.' marketRate={exchangeRates.curve.mgpRMGP} supply={supplies.rmgp} symbol='rMGP' underlying={locked.reefiMGP} underlyingSymbol='MGP' />
    <TokenCard color='green' decimals={decimals.yMGP} description='yMGP is backed 1:1 by rMGP but cannot be converted back to rMGP. 5% of protocol yield and withdrawals are distributed to locked yMGP paid in rMGP.' locked={locked.ymgp} marketRate={exchangeRates.curve.rmgpYMGP} supply={supplies.ymgp + locked.ymgp} symbol='yMGP' underlying={supplies.ymgp + locked.ymgp} underlyingSymbol='rMGP' />
    {/* <TokenCard symbol='vMGP' decimals={decimals.VMGP} supply={vmgpSupply} marketRate={exchangeRates.curve.ymgpVMGP} voteMultiplier={Number(vmgpSupply ?? 0n)/Number(rmgpSupply ?? 0n)} underlying={vmgpSupply} underlyingSymbol='yMGP' features={{ "Boosted Votes": "Control all of Reefi's vote power" }} description="vMGP is backed 1:1 by yMGP but cannot be converted back to yMGP. vMGP controls all of Reefi's voting power." /> */}
  </div>;
});
TokenCards.displayName = "TokenCards";
