import { formatEther } from "../utilities";

import { AllCoin, CoreCoin } from "../config/contracts";
import { Button } from "./Button";
import { JSX, memo, ReactElement } from "react";
import { TokenApproval } from "./TokenApproval";

interface Properties {
  readonly send: bigint;
  readonly curveAmount: bigint;
  readonly allowanceCurve: bigint;
  readonly nativeRate: number;
  readonly onApprove: (_infinity: boolean) => void;
  readonly buy: (_tokenIn: AllCoin, _tokenOut: CoreCoin) => void;
  readonly tokenIn: AllCoin;
  readonly tokenOut: CoreCoin;
}

export const BuyOnCurve = memo(({ send, curveAmount, allowanceCurve, nativeRate, onApprove, buy, tokenIn, tokenOut }: Properties): ReactElement => <div>
  <TokenApproval allowance={allowanceCurve} curve={true} onApprove={onApprove} send={send} tokenSymbol={tokenIn} />
  <div className="relative">
    <Button variant="secondary" className="w-full" onClick={() => buy(tokenIn, tokenOut)} type="submit">Buy on Curve ({formatEther(curveAmount).toFixed(4)} {tokenOut})</Button>
    {((): JSX.Element | undefined => {
      const directRate = formatEther(send) * nativeRate;
      const premiumDiscount = (formatEther(curveAmount) - directRate) / directRate * 100;
      const isPremium = premiumDiscount > 0;
      return Math.abs(premiumDiscount) >= 0.01 ? <span className={`absolute -top-4 right-2 rounded px-2 py-1 text-xs md:-top-2 ${isPremium ? "bg-green-800/80 text-green-200" : "bg-red-800/80 text-red-200"}`}>{isPremium ? "+" : ""}{premiumDiscount.toFixed(2)}%</span> : undefined;
    })()}
  </div>
</div>);
BuyOnCurve.displayName = "BuyOnCurve";
