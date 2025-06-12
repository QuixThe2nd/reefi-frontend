import { formatEther } from "../utilities";
import { memo, type ReactElement, type Dispatch, type SetStateAction } from "react";
import { useWriteContract, type UseWriteContractReturnType } from "wagmi";

import { AmountInput } from "../components/AmountInput";
import { Button } from "../components/Button";
import { Page } from "../components/Page";

import type { PrimaryCoin } from "../config/contracts";
import type { wagmiConfig } from "..";

interface Properties {
  readonly mgpBalance: bigint;
  readonly rmgpBalance: bigint;
  readonly ymgpBalance: bigint;
  readonly setLPAmounts: Dispatch<SetStateAction<Record<PrimaryCoin, bigint>>>;
  readonly mgpLPAmount: bigint;
  readonly rmgpLPAmount: bigint;
  readonly ymgpLPAmount: bigint;
  readonly mgpCurveBalance: bigint;
  readonly rmgpCurveBalance: bigint;
  readonly ymgpCurveBalance: bigint;
  readonly supplyLiquidity: (_writeContract: UseWriteContractReturnType<typeof wagmiConfig>["writeContract"]) => void;
}

const mgpPlaceholder = (mgpCurveBalance: bigint, rmgpCurveBalance: bigint, ymgpCurveBalance: bigint, rmgpLPAmount: bigint, ymgpLPAmount: bigint): string => {
  const mgpTarget = mgpCurveBalance === 0n ? 0 : Number(mgpCurveBalance) / Number(mgpCurveBalance + rmgpCurveBalance + ymgpCurveBalance);
  const getTotalRecommendedLP = (): number => {
    let val = Number(rmgpLPAmount + ymgpLPAmount);
    if (rmgpLPAmount === 0n) val = Number(ymgpLPAmount) / (Number(ymgpCurveBalance) / Number(rmgpCurveBalance + ymgpCurveBalance));
    if (ymgpLPAmount === 0n) val = Number(rmgpLPAmount) / (Number(rmgpCurveBalance) / Number(rmgpCurveBalance + ymgpCurveBalance));
    if (Number.isNaN(val)) return 0;
    return val;
  };
  return formatEther(BigInt(getTotalRecommendedLP() * mgpTarget / (1 - mgpTarget))).toString();
};

const rmgpPlaceholder = (mgpCurveBalance: bigint, rmgpCurveBalance: bigint, ymgpCurveBalance: bigint, mgpLPAmount: bigint, rmgpLPAmount: bigint, ymgpLPAmount: bigint): string => {
  const rmgpTarget = rmgpCurveBalance === 0n ? 0 : Number(rmgpCurveBalance) / Number(mgpCurveBalance + rmgpCurveBalance + ymgpCurveBalance);
  const getTotalRecommendedLP = (): number => {
    let val = Number(rmgpLPAmount + ymgpLPAmount);
    if (mgpLPAmount === 0n) val = Number(ymgpLPAmount) / (Number(ymgpCurveBalance) / Number(mgpCurveBalance + ymgpCurveBalance));
    if (ymgpLPAmount === 0n) val = Number(mgpLPAmount) / (Number(mgpCurveBalance) / Number(mgpCurveBalance + ymgpCurveBalance));
    if (Number.isNaN(val)) return 0;
    return val;
  };
  return formatEther(BigInt(getTotalRecommendedLP() * rmgpTarget / (1 - rmgpTarget))).toString();
};

const ymgpPlaceholder = (mgpCurveBalance: bigint, rmgpCurveBalance: bigint, ymgpCurveBalance: bigint, mgpLPAmount: bigint, rmgpLPAmount: bigint, ymgpLPAmount: bigint): string => {
  const ymgpTarget = ymgpCurveBalance === 0n ? 0 : Number(ymgpCurveBalance) / Number(mgpCurveBalance + rmgpCurveBalance + ymgpCurveBalance);
  const getTotalRecommendedLP = (): number => {
    let val = Number(rmgpLPAmount + ymgpLPAmount);
    if (rmgpLPAmount === 0n) val = Number(mgpLPAmount) / (Number(mgpCurveBalance) / Number(rmgpCurveBalance + mgpCurveBalance));
    if (mgpLPAmount === 0n) val = Number(rmgpLPAmount) / (Number(rmgpCurveBalance) / Number(rmgpCurveBalance + mgpCurveBalance));
    if (Number.isNaN(val)) return 0;
    return val;
  };
  return formatEther(BigInt(getTotalRecommendedLP() * ymgpTarget / (1 - ymgpTarget))).toString();
};

export const SupplyLiquidityPage = memo(({ mgpBalance, rmgpBalance, ymgpBalance, setLPAmounts, mgpLPAmount, rmgpLPAmount, ymgpLPAmount, mgpCurveBalance, rmgpCurveBalance, ymgpCurveBalance, supplyLiquidity }: Properties): ReactElement => {
  const { writeContract, isPending } = useWriteContract();
  return <Page info={<span>Supply liquidity to the cMGP Curve pool (MGP/wstMGP/yMGP). You can supply liquidity at any ratio of MGP:wstMGP:yMGP, however it is recommended you match the targets to prevent slippage. To stake or withdraw liquidity, use <a className="text-blue-400" href="https://www.curve.finance/dex/arbitrum/pools/factory-stable-ng-179/withdraw/">Curve</a>.</span>}>
    <AmountInput balance={mgpBalance} label="Supply MGP" onChange={val => setLPAmounts(a => ({ ...a, MGP: val }))} placeholder={mgpPlaceholder(mgpCurveBalance, rmgpCurveBalance, ymgpCurveBalance, rmgpLPAmount, ymgpLPAmount)} token={{ symbol: "MGP" }} value={mgpLPAmount} />
    <div className="mb-4 flex justify-between text-sm text-gray-400">
      <span>Target</span>
      <span>{(100 * Number(mgpCurveBalance) / Number(mgpCurveBalance + rmgpCurveBalance + ymgpCurveBalance)).toFixed(0)}%</span>
    </div>
    <AmountInput balance={rmgpBalance} label="Supply wstMGP" onChange={val => setLPAmounts(a => ({ ...a, wstMGP: val }))} placeholder={rmgpPlaceholder(mgpCurveBalance, rmgpCurveBalance, ymgpCurveBalance, mgpLPAmount, rmgpLPAmount, ymgpLPAmount)} token={{ symbol: "wstMGP" }} value={rmgpLPAmount} />
    <div className="mb-4 flex justify-between text-sm text-gray-400">
      <span>Target</span>
      <span>{(100 * Number(rmgpCurveBalance) / Number(mgpCurveBalance + rmgpCurveBalance + ymgpCurveBalance)).toFixed(0)}%</span>
    </div>
    <AmountInput balance={ymgpBalance} label="Supply yMGP" onChange={val => setLPAmounts(a => ({ ...a, yMGP: val }))} placeholder={ymgpPlaceholder(mgpCurveBalance, rmgpCurveBalance, ymgpCurveBalance, mgpLPAmount, rmgpLPAmount, ymgpLPAmount)} token={{ symbol: "yMGP" }} value={ymgpLPAmount} />
    <div className="mb-4 flex justify-between text-sm text-gray-400">
      <span>Target</span>
      <span>{(100 * Number(ymgpCurveBalance) / Number(mgpCurveBalance + rmgpCurveBalance + ymgpCurveBalance)).toFixed(0)}%</span>
    </div>
    <Button className="w-full" isLoading={isPending} onClick={() => supplyLiquidity(writeContract)} type="submit">Get cMGP</Button>
  </Page>;
});
SupplyLiquidityPage.displayName = "SupplyLiquidityPage";
