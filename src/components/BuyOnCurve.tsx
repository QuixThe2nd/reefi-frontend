import { formatEther } from "../utilities";

import { Button } from "./Button";
import { JSX, memo, ReactElement } from "react";
import { TokenApproval } from "./TokenApproval";
import { UseAmounts } from "../hooks/useAmounts";

interface Properties {
  readonly send: UseAmounts["amounts"]["send"];
  readonly curveAmount: bigint;
  readonly allowanceCurve: bigint;
  readonly nativeRate: number;
  readonly onApprove: (_infinity: boolean) => void;
  readonly buy: () => void;
  readonly tokenASymbol: string;
  readonly tokenBSymbol: string;
}

export const BuyOnCurve = memo(({ send, curveAmount, allowanceCurve, nativeRate, onApprove, buy, tokenASymbol, tokenBSymbol }: Properties): ReactElement => <div>
  <TokenApproval allowance={allowanceCurve} curve={true} onApprove={onApprove} send={send} tokenSymbol={tokenASymbol} />
  <div className="relative">
    <Button variant="secondary" className="w-full" onClick={buy} type="submit">Buy on Curve ({formatEther(curveAmount).toFixed(4)} {tokenBSymbol})</Button>
    {((): JSX.Element | undefined => {
      const directRate = formatEther(send ?? 0n) * nativeRate;
      const premiumDiscount = (formatEther(curveAmount) - directRate) / directRate * 100;
      const isPremium = premiumDiscount > 0;
      return Math.abs(premiumDiscount) >= 0.01 ? <span className={`absolute -top-4 right-2 rounded px-2 py-1 text-xs md:-top-2 ${isPremium ? "bg-green-800/80 text-green-200" : "bg-red-800/80 text-red-200"}`}>{isPremium ? "+" : ""}{premiumDiscount.toFixed(2)}%</span> : undefined;
    })()}
  </div>
</div>);
BuyOnCurve.displayName = "BuyOnCurve";
