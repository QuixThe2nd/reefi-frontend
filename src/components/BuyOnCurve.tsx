import { formatEther } from "../utilities";

import { JSX, memo, ReactElement } from "react";
import { TokenApproval } from "./TokenApproval";

interface Properties {
  readonly sendAmount: bigint;
  readonly curveAmount: bigint;
  readonly allowanceCurve: bigint;
  readonly nativeRate: number;
  readonly onApprove: (_infinity: boolean) => void;
  readonly buy: () => void;
  readonly tokenASymbol: string;
  readonly tokenBSymbol: string;
}

export const BuyOnCurve = memo(({ sendAmount, curveAmount, allowanceCurve, nativeRate, onApprove, buy, tokenASymbol, tokenBSymbol }: Properties): ReactElement => <div>
  <TokenApproval allowance={allowanceCurve} curve={true} onApprove={onApprove} sendAmount={sendAmount} tokenSymbol={tokenASymbol} />
  <div className="relative">
    <button className="h-min w-full rounded-lg bg-green-600 py-2 text-xs transition-colors hover:bg-green-700 md:text-base" onClick={buy} type="submit">Buy on Curve ({formatEther(curveAmount).toFixed(4)} {tokenBSymbol})</button>
    {((): JSX.Element | undefined => {
      const directRate = formatEther(sendAmount) * nativeRate;
      const premiumDiscount = (formatEther(curveAmount) - directRate) / directRate * 100;
      const isPremium = premiumDiscount > 0;
      return Math.abs(premiumDiscount) >= 0.01 ? <span className={`absolute -top-4 right-2 rounded px-2 py-1 text-xs md:-top-2 ${isPremium ? "bg-green-800/80 text-green-200" : "bg-red-800/80 text-red-200"}`}>{isPremium ? "+" : ""}{premiumDiscount.toFixed(2)}%</span> : undefined;
    })()}
  </div>
</div>);
BuyOnCurve.displayName = "BuyOnCurve";
