import { formatEther } from "../utilities";
import { memo, type JSX, type ReactElement } from "react";
import { useWriteContract, type UseWriteContractReturnType } from "wagmi";

import { Button } from "./Button";
import { TokenApproval } from "./TokenApproval";

import type { PrimaryCoin } from "../config/contracts";
import type { wagmiConfig } from "..";

interface Properties {
  readonly send: bigint;
  readonly curveAmount: bigint;
  readonly allowanceCurve: bigint;
  readonly nativeRate: number;
  readonly onApprove: (_infinity: boolean) => void;
  readonly buy: (_tokenIn: PrimaryCoin, _tokenOut: PrimaryCoin, _writeContract: UseWriteContractReturnType<typeof wagmiConfig>["writeContract"]) => void;
  readonly tokenIn: PrimaryCoin;
  readonly tokenOut: PrimaryCoin;
  readonly isLoading: boolean;
}

export const BuyOnCurve = memo(({ send, curveAmount, allowanceCurve, nativeRate, onApprove, buy, tokenIn, tokenOut, isLoading }: Properties): ReactElement => {
  const { writeContract, isPending } = useWriteContract();
  return <div>
    <TokenApproval allowance={allowanceCurve} curve isLoading={isLoading} onApprove={onApprove} send={send} tokenSymbol={tokenIn} />
    <div className="relative">
      <Button className="w-full" isLoading={isPending} onClick={() => buy(tokenIn, tokenOut, writeContract)} type="submit" variant="secondary">Buy on Curve ({formatEther(curveAmount).toFixed(4)} {tokenOut})</Button>
      {((): JSX.Element | undefined => {
        const directRate = formatEther(send) * nativeRate;
        const premiumDiscount = (formatEther(curveAmount) - directRate) / directRate * 100;
        const isPremium = premiumDiscount > 0;
        return Math.abs(premiumDiscount) >= 0.01 ? <span className={`absolute -top-4 right-2 rounded px-2 py-1 text-xs md:-top-2 ${isPremium ? "bg-green-800/80 text-green-200" : "bg-red-800/80 text-red-200"}`}>{isPremium ? "+" : ""}{premiumDiscount.toFixed(2)}%</span> : undefined;
      })()}
    </div>
  </div>;
});
BuyOnCurve.displayName = "BuyOnCurve";
