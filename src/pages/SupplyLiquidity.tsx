import { formatEther } from "../utilities";
import { useWriteSaveContract } from "../hooks/useWriteSaveContract";

import { AmountInput } from "../components/AmountInput";
import { Button } from "../components/Button";
import { Page } from "../components/Page";

import type { PrimaryCoin } from "../state/useContracts";
import type { ReactElement, Dispatch, SetStateAction } from "react";
import type { UseWriteContractReturnType } from "wagmi";
import type { wagmiConfig } from "..";

interface Properties {
  readonly mgpBalance: bigint;
  readonly stmgpBalance: bigint;
  readonly ymgpBalance: bigint;
  readonly vmgpBalance: bigint;
  readonly rmgpBalance: bigint;
  readonly mgpLPAmount: bigint;
  readonly stmgpLPAmount: bigint;
  readonly ymgpLPAmount: bigint;
  readonly vmgpLPAmount: bigint;
  readonly rmgpLPAmount: bigint;
  readonly setLPAmounts: Dispatch<SetStateAction<Record<Exclude<PrimaryCoin, "bMGP" | "wstMGP" | "syMGP">, bigint>>>;
  readonly mgpCurveBalance: bigint;
  readonly stmgpCurveBalance: bigint;
  readonly ymgpCurveBalance: bigint;
  readonly vmgpCurveBalance: bigint;
  readonly rmgpCurveBalance: bigint;
  readonly supplyLiquidity: (_writeContract: UseWriteContractReturnType<typeof wagmiConfig>["writeContract"]) => void;
}

const mgpPlaceholder = (mgpCurveBalance: bigint, stmgpCurveBalance: bigint, ymgpCurveBalance: bigint, vmgpCurveBalance: bigint, rmgpCurveBalance: bigint, mgpLPAmount: bigint, stmgpLPAmount: bigint, ymgpLPAmount: bigint, vmgpLPAmount: bigint, rmgpLPAmount: bigint): string => {
  const otherBalancesSum = Number(stmgpCurveBalance + ymgpCurveBalance + vmgpCurveBalance + rmgpCurveBalance);
  const mgpPercent = mgpCurveBalance === 0n ? 0 : Number(mgpCurveBalance) / (Number(mgpCurveBalance) + otherBalancesSum);
  const stmgpPercent = mgpCurveBalance === 0n ? 0 : Number(stmgpCurveBalance) / (Number(stmgpCurveBalance) + otherBalancesSum);
  const ymgpPercent = mgpCurveBalance === 0n ? 0 : Number(ymgpCurveBalance) / (Number(ymgpCurveBalance) + otherBalancesSum);
  const vmgpPercent = mgpCurveBalance === 0n ? 0 : Number(vmgpCurveBalance) / (Number(vmgpCurveBalance) + otherBalancesSum);
  const rmgpPercent = mgpCurveBalance === 0n ? 0 : Number(rmgpCurveBalance) / (Number(rmgpCurveBalance) + otherBalancesSum);

  const weightedAmounts = (Number(mgpLPAmount) * mgpPercent + Number(stmgpLPAmount) * stmgpPercent + Number(ymgpLPAmount) * ymgpPercent + Number(vmgpLPAmount) * vmgpPercent + Number(rmgpLPAmount) * rmgpPercent) * 5;
  const targetTotalAmount = weightedAmounts / (1 - mgpPercent);
  const targetAmount = targetTotalAmount * mgpPercent;
  return formatEther(BigInt(targetAmount)).toString();
};

const stmgpPlaceholder = (mgpCurveBalance: bigint, stmgpCurveBalance: bigint, ymgpCurveBalance: bigint, vmgpCurveBalance: bigint, rmgpCurveBalance: bigint, mgpLPAmount: bigint, stmgpLPAmount: bigint, ymgpLPAmount: bigint, vmgpLPAmount: bigint, rmgpLPAmount: bigint): string => {
  const otherBalancesSum = Number(stmgpCurveBalance + ymgpCurveBalance + vmgpCurveBalance + rmgpCurveBalance);
  const mgpPercent = mgpCurveBalance === 0n ? 0 : Number(mgpCurveBalance) / (Number(mgpCurveBalance) + otherBalancesSum);
  const stmgpPercent = mgpCurveBalance === 0n ? 0 : Number(stmgpCurveBalance) / (Number(stmgpCurveBalance) + otherBalancesSum);
  const ymgpPercent = mgpCurveBalance === 0n ? 0 : Number(ymgpCurveBalance) / (Number(ymgpCurveBalance) + otherBalancesSum);
  const vmgpPercent = mgpCurveBalance === 0n ? 0 : Number(vmgpCurveBalance) / (Number(vmgpCurveBalance) + otherBalancesSum);
  const rmgpPercent = mgpCurveBalance === 0n ? 0 : Number(rmgpCurveBalance) / (Number(rmgpCurveBalance) + otherBalancesSum);

  const weightedAmounts = (Number(mgpLPAmount) * mgpPercent + Number(stmgpLPAmount) * stmgpPercent + Number(ymgpLPAmount) * ymgpPercent + Number(vmgpLPAmount) * vmgpPercent + Number(rmgpLPAmount) * rmgpPercent) * 5;
  const targetTotalAmount = weightedAmounts / (1 - stmgpPercent);
  const targetAmount = targetTotalAmount * stmgpPercent;
  return formatEther(BigInt(targetAmount)).toString();
};

const ymgpPlaceholder = (mgpCurveBalance: bigint, stmgpCurveBalance: bigint, ymgpCurveBalance: bigint, vmgpCurveBalance: bigint, rmgpCurveBalance: bigint, mgpLPAmount: bigint, stmgpLPAmount: bigint, ymgpLPAmount: bigint, vmgpLPAmount: bigint, rmgpLPAmount: bigint): string => {
  const otherBalancesSum = Number(stmgpCurveBalance + ymgpCurveBalance + vmgpCurveBalance + rmgpCurveBalance);
  const mgpPercent = mgpCurveBalance === 0n ? 0 : Number(mgpCurveBalance) / (Number(mgpCurveBalance) + otherBalancesSum);
  const stmgpPercent = mgpCurveBalance === 0n ? 0 : Number(stmgpCurveBalance) / (Number(stmgpCurveBalance) + otherBalancesSum);
  const ymgpPercent = mgpCurveBalance === 0n ? 0 : Number(ymgpCurveBalance) / (Number(ymgpCurveBalance) + otherBalancesSum);
  const vmgpPercent = mgpCurveBalance === 0n ? 0 : Number(vmgpCurveBalance) / (Number(vmgpCurveBalance) + otherBalancesSum);
  const rmgpPercent = mgpCurveBalance === 0n ? 0 : Number(rmgpCurveBalance) / (Number(rmgpCurveBalance) + otherBalancesSum);

  const weightedAmounts = (Number(mgpLPAmount) * mgpPercent + Number(stmgpLPAmount) * stmgpPercent + Number(ymgpLPAmount) * ymgpPercent + Number(vmgpLPAmount) * vmgpPercent + Number(rmgpLPAmount) * rmgpPercent) * 5;
  const targetTotalAmount = weightedAmounts / (1 - ymgpPercent);
  const targetAmount = targetTotalAmount * ymgpPercent;
  return formatEther(BigInt(targetAmount)).toString();
};

const vmgpPlaceholder = (mgpCurveBalance: bigint, stmgpCurveBalance: bigint, ymgpCurveBalance: bigint, vmgpCurveBalance: bigint, rmgpCurveBalance: bigint, mgpLPAmount: bigint, stmgpLPAmount: bigint, ymgpLPAmount: bigint, vmgpLPAmount: bigint, rmgpLPAmount: bigint): string => {
  const otherBalancesSum = Number(stmgpCurveBalance + ymgpCurveBalance + vmgpCurveBalance + rmgpCurveBalance);
  const mgpPercent = mgpCurveBalance === 0n ? 0 : Number(mgpCurveBalance) / (Number(mgpCurveBalance) + otherBalancesSum);
  const stmgpPercent = mgpCurveBalance === 0n ? 0 : Number(stmgpCurveBalance) / (Number(stmgpCurveBalance) + otherBalancesSum);
  const ymgpPercent = mgpCurveBalance === 0n ? 0 : Number(ymgpCurveBalance) / (Number(ymgpCurveBalance) + otherBalancesSum);
  const vmgpPercent = mgpCurveBalance === 0n ? 0 : Number(vmgpCurveBalance) / (Number(vmgpCurveBalance) + otherBalancesSum);
  const rmgpPercent = mgpCurveBalance === 0n ? 0 : Number(rmgpCurveBalance) / (Number(rmgpCurveBalance) + otherBalancesSum);

  const weightedAmounts = (Number(mgpLPAmount) * mgpPercent + Number(stmgpLPAmount) * stmgpPercent + Number(ymgpLPAmount) * ymgpPercent + Number(vmgpLPAmount) * vmgpPercent + Number(rmgpLPAmount) * rmgpPercent) * 5;
  const targetTotalAmount = weightedAmounts / (1 - vmgpPercent);
  const targetAmount = targetTotalAmount * vmgpPercent;
  return formatEther(BigInt(targetAmount)).toString();
};

const rmgpPlaceholder = (mgpCurveBalance: bigint, stmgpCurveBalance: bigint, ymgpCurveBalance: bigint, vmgpCurveBalance: bigint, rmgpCurveBalance: bigint, mgpLPAmount: bigint, stmgpLPAmount: bigint, ymgpLPAmount: bigint, vmgpLPAmount: bigint, rmgpLPAmount: bigint): string => {
  const otherBalancesSum = Number(stmgpCurveBalance + ymgpCurveBalance + vmgpCurveBalance + rmgpCurveBalance);
  const mgpPercent = mgpCurveBalance === 0n ? 0 : Number(mgpCurveBalance) / (Number(mgpCurveBalance) + otherBalancesSum);
  const stmgpPercent = mgpCurveBalance === 0n ? 0 : Number(stmgpCurveBalance) / (Number(stmgpCurveBalance) + otherBalancesSum);
  const ymgpPercent = mgpCurveBalance === 0n ? 0 : Number(ymgpCurveBalance) / (Number(ymgpCurveBalance) + otherBalancesSum);
  const vmgpPercent = mgpCurveBalance === 0n ? 0 : Number(vmgpCurveBalance) / (Number(vmgpCurveBalance) + otherBalancesSum);
  const rmgpPercent = mgpCurveBalance === 0n ? 0 : Number(rmgpCurveBalance) / (Number(rmgpCurveBalance) + otherBalancesSum);

  const weightedAmounts = (Number(mgpLPAmount) * mgpPercent + Number(stmgpLPAmount) * stmgpPercent + Number(ymgpLPAmount) * ymgpPercent + Number(vmgpLPAmount) * vmgpPercent + Number(rmgpLPAmount) * rmgpPercent) * 5;
  const targetTotalAmount = weightedAmounts / (1 - rmgpPercent);
  const targetAmount = targetTotalAmount * rmgpPercent;
  return formatEther(BigInt(targetAmount)).toString();
};

export const SupplyLiquidity = ({ mgpBalance, stmgpBalance, ymgpBalance, vmgpBalance, rmgpBalance, mgpLPAmount, stmgpLPAmount, ymgpLPAmount, vmgpLPAmount, rmgpLPAmount, setLPAmounts, mgpCurveBalance, stmgpCurveBalance, ymgpCurveBalance, vmgpCurveBalance, rmgpCurveBalance, supplyLiquidity }: Properties): ReactElement => {
  const { writeContract, isPending } = useWriteSaveContract("Liquidity Supplied");
  return <Page info={<span>Supply liquidity to the cMGP Curve pool (MGP/wstMGP/yMGP). You can supply liquidity at any ratio of MGP:wstMGP:yMGP, however it is recommended you match the targets to prevent slippage. To stake or withdraw liquidity, use <a className="text-blue-400" href="https://www.curve.finance/dex/arbitrum/pools/factory-stable-ng-179/withdraw/">Curve</a>.</span>}>
    <AmountInput balance={mgpBalance} label="Supply MGP" onChange={val => setLPAmounts(a => ({ ...a, MGP: val }))} placeholder={mgpPlaceholder(mgpCurveBalance, stmgpCurveBalance, ymgpCurveBalance, vmgpCurveBalance, rmgpCurveBalance, mgpLPAmount, stmgpLPAmount, ymgpLPAmount, vmgpLPAmount, rmgpLPAmount)} token={{ symbol: "MGP" }} value={mgpLPAmount} />
    <div className="mb-4 flex justify-between text-sm text-gray-400">
      <span>Target</span>
      <span>{(100 * Number(mgpCurveBalance) / Number(mgpCurveBalance + stmgpCurveBalance + ymgpCurveBalance + vmgpCurveBalance + rmgpCurveBalance)).toFixed(0)}%</span>
    </div>
    <AmountInput balance={stmgpBalance} label="Supply stMGP" onChange={val => setLPAmounts(a => ({ ...a, stMGP: val }))} placeholder={stmgpPlaceholder(mgpCurveBalance, stmgpCurveBalance, ymgpCurveBalance, vmgpCurveBalance, rmgpCurveBalance, mgpLPAmount, stmgpLPAmount, ymgpLPAmount, vmgpLPAmount, rmgpLPAmount)} token={{ symbol: "stMGP" }} value={stmgpLPAmount} />
    <div className="mb-4 flex justify-between text-sm text-gray-400">
      <span>Target</span>
      <span>{(100 * Number(stmgpCurveBalance) / Number(mgpCurveBalance + stmgpCurveBalance + ymgpCurveBalance + vmgpCurveBalance + rmgpCurveBalance)).toFixed(0)}%</span>
    </div>
    <AmountInput balance={ymgpBalance} label="Supply yMGP" onChange={val => setLPAmounts(a => ({ ...a, yMGP: val }))} placeholder={ymgpPlaceholder(mgpCurveBalance, stmgpCurveBalance, ymgpCurveBalance, vmgpCurveBalance, rmgpCurveBalance, mgpLPAmount, stmgpLPAmount, ymgpLPAmount, vmgpLPAmount, rmgpLPAmount)} token={{ symbol: "yMGP" }} value={ymgpLPAmount} />
    <div className="mb-4 flex justify-between text-sm text-gray-400">
      <span>Target</span>
      <span>{(100 * Number(ymgpCurveBalance) / Number(mgpCurveBalance + stmgpCurveBalance + ymgpCurveBalance + vmgpCurveBalance + rmgpCurveBalance)).toFixed(0)}%</span>
    </div>
    <AmountInput balance={vmgpBalance} label="Supply vMGP" onChange={val => setLPAmounts(a => ({ ...a, vMGP: val }))} placeholder={vmgpPlaceholder(mgpCurveBalance, stmgpCurveBalance, ymgpCurveBalance, vmgpCurveBalance, rmgpCurveBalance, mgpLPAmount, stmgpLPAmount, ymgpLPAmount, vmgpLPAmount, rmgpLPAmount)} token={{ symbol: "vMGP" }} value={vmgpLPAmount} />
    <div className="mb-4 flex justify-between text-sm text-gray-400">
      <span>Target</span>
      <span>{(100 * Number(vmgpCurveBalance) / Number(mgpCurveBalance + stmgpCurveBalance + ymgpCurveBalance + vmgpCurveBalance + rmgpCurveBalance)).toFixed(0)}%</span>
    </div>
    <AmountInput balance={rmgpBalance} label="Supply rMGP" onChange={val => setLPAmounts(a => ({ ...a, rMGP: val }))} placeholder={rmgpPlaceholder(mgpCurveBalance, stmgpCurveBalance, ymgpCurveBalance, vmgpCurveBalance, rmgpCurveBalance, mgpLPAmount, stmgpLPAmount, ymgpLPAmount, vmgpLPAmount, rmgpLPAmount)} token={{ symbol: "rMGP" }} value={rmgpLPAmount} />
    <div className="mb-4 flex justify-between text-sm text-gray-400">
      <span>Target</span>
      <span>{(100 * Number(rmgpCurveBalance) / Number(mgpCurveBalance + stmgpCurveBalance + ymgpCurveBalance + vmgpCurveBalance + rmgpCurveBalance)).toFixed(0)}%</span>
    </div>
    <Button className="w-full" isLoading={isPending} onClick={() => supplyLiquidity(writeContract)} type="submit">Get cMGP</Button>
  </Page>;
};
