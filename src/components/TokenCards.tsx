import { TokenCard } from "./TokenCard";

import type { ReactElement } from "react";
import type { useSupplies } from "../state/useSupplies";

interface Properties {
  readonly supplies: ReturnType<typeof useSupplies>;
  readonly mgpPrice: number;
  readonly mgpStmgpCurveRate: number;
  readonly wstmgpYmgpCurveRate: number;
  readonly ymgpVmgpCurveRate: number;
  readonly stmgpRmgpCurveRate: number;
}

export const TokenCards = ({ mgpPrice, supplies, mgpStmgpCurveRate, wstmgpYmgpCurveRate, ymgpVmgpCurveRate, stmgpRmgpCurveRate }: Properties): ReactElement => <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
  <TokenCard description="MGP is the underlying asset all derivatives rely on. It is Magpie's core governance token." locked={supplies.vlMGP} price={mgpPrice} supply={supplies.MGP} symbol="MGP" />
  <TokenCard description="stMGP earns auto compounding yield from locked MGP, while remaining liquid. stMGP is rebasing and can be converted back to MGP 1:1." marketRate={mgpStmgpCurveRate} supply={supplies.stMGP} symbol="stMGP" underlying={supplies.stMGP} underlyingSymbol="MGP" />
  <TokenCard description="yMGP is backed 1:1 by wstMGP but has a 25% withdraw fee. 5% of vlMGP yield is distributed to syMGP, automatically compounded." locked={supplies.syMGP / 2n} marketRate={wstmgpYmgpCurveRate} supply={supplies.yMGP} symbol="yMGP" underlying={supplies.yMGP} underlyingSymbol="wstMGP" />
  <TokenCard description="vMGP is backed 1:1 by yMGP but cannot be converted back to yMGP. vMGP controls all of Reefi's voting power." marketRate={ymgpVmgpCurveRate} supply={supplies.vMGP} symbol="vMGP" underlying={supplies.vMGP} underlyingSymbol="yMGP" voteMultiplier={Number(supplies.stMGP) / Number(supplies.vMGP)} />
  <TokenCard description="rMGP is a Syntheic MGP, not backed by any underlying MGP. rMGP is a Pendle-like token with no maturity allowing for trading on yield." locked={supplies.syMGP / 2n} marketRate={stmgpRmgpCurveRate} supply={supplies.rMGP} symbol="rMGP" underlying={supplies.rMGP} />
</div>;
