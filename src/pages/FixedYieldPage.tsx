import { formatEther, formatTime } from "../utilities";
import { memo, type ReactElement } from "react";

import { Chains } from "../config/contracts";
import { Page } from "../components/Page";
import { SwapToken } from "../components/SwapToken";
import { UseAllowances } from "../hooks/useAllowances";
import { UseAmounts } from "../hooks/useAmounts";
import { UsePrices } from "../hooks/usePrices";
import { UseWithdraws } from "../hooks/useWithdraws";

interface Properties {
  mgpAPR: number;
  balances: UseBalances["balances"];
  setSend: (_send: bigint) => void;
  send: UseAmounts["amounts"]["send"];
  prices: UsePrices;
  ymgpMgpCurveRate: number;
  mgpRmgpCurveRate: number;
  mgpRmgpCurveAmount: bigint;
  rmgpYmgpCurveAmount: bigint;
  rmgpMgpCurveAmount: bigint;
  mgpYmgpCurveAmount: bigint;
  ymgpRmgpCurveAmount: bigint;
  ymgpMgpCurveAmount: bigint;
  ymgpVmgpCurveAmount: bigint;
  allowances: UseAllowances["allowances"];
  chain: Chains;
  lockedReefiMGP: bigint;
  rmgpSupply: bigint;
  unlockSchedule: UseWithdraws["withdraws"]["unlockSchedule"];
  approve: (_tokenOut: "rMGP" | "yMGP" | "vMGP" | "cMGP" | "odosRouter", _tokenIn: TransferrableCoin, _infinity: boolean) => void;
  convertMGP: () => void;
  sellYMGP: () => void;
  mintWETH: () => void;
  swap: (_tokenIn: `0x${string}`, _tokenOut: `0x${string}`) => void;
  buyRMGPAndWithdraw: () => void;
}

export const FixedYieldPage = memo(({ mgpAPR, balances, setSend, send, prices, ymgpMgpCurveRate, mgpRmgpCurveRate, mgpRmgpCurveAmount, rmgpYmgpCurveAmount, rmgpMgpCurveAmount, mgpYmgpCurveAmount, ymgpRmgpCurveAmount, ymgpMgpCurveAmount, ymgpVmgpCurveAmount, allowances, chain, approve, convertMGP, sellYMGP, mintWETH, swap, lockedReefiMGP, rmgpSupply, unlockSchedule, buyRMGPAndWithdraw }: Properties): ReactElement => {
  const burnRate = Number(rmgpSupply) / Number(lockedReefiMGP);
  const fixedYieldPercent = (Number(mgpRmgpCurveAmount) / Number(send) / burnRate - 1) * 100;
  const withdrawalTime = unlockSchedule.length === 6 ? Number(unlockSchedule[0]?.endTime) - Date.now() / 1000 + 60 * 60 * 24 * 30 * 2 : 60 * 60 * 24 * 30 * 2;
  const daysToWithdraw = withdrawalTime / (60 * 60 * 24);
  const annualizedYield = fixedYieldPercent / 100 * (365 / daysToWithdraw) * 100;

  return <Page info={[
    "Swap MGP to rMGP under the peg, then immediately submit for withdrawal to earn guaranteed yield and wait 60-120 days.",
    "This strategy monetizes the rMGP depeg by capturing the difference between market price and the burn rate.",
    "The yield is fixed and known upfront, unlike variable staking yields that can change over time."
  ]}>
    <SwapToken
      buy={buyRMGPAndWithdraw}
      excludeCoins={["CKP", "PNP", "EGP", "LTP", "WETH", "yMGP"]}
      label="Buy & Withdraw"
      originalTokenIn="MGP"
      tokenOut="rMGP"
      balances={balances}
      setSend={setSend}
      send={send}
      prices={prices}
      ymgpMgpCurveRate={ymgpMgpCurveRate}
      mgpRmgpCurveRate={mgpRmgpCurveRate}
      mgpRmgpCurveAmount={mgpRmgpCurveAmount}
      rmgpYmgpCurveAmount={rmgpYmgpCurveAmount}
      rmgpMgpCurveAmount={rmgpMgpCurveAmount}
      mgpYmgpCurveAmount={mgpYmgpCurveAmount}
      ymgpRmgpCurveAmount={ymgpRmgpCurveAmount}
      ymgpMgpCurveAmount={ymgpMgpCurveAmount}
      ymgpVmgpCurveAmount={ymgpVmgpCurveAmount}
      allowances={allowances}
      chain={chain}
      approve={approve}
      convertMGP={convertMGP}
      sellYMGP={sellYMGP}
      mintWETH={mintWETH}
      swap={swap}
      lockedReefiMGP={lockedReefiMGP}
      rmgpSupply={rmgpSupply}
    />

    <div className="mt-4 rounded-lg border border-green-700 bg-green-900/20 p-4">
      <h3 className="mb-2 text-lg font-semibold text-green-400">🎯 Earn Fixed Yield</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Market Rate:</span>
          <span className="text-red-400">1 MGP = {mgpRmgpCurveRate.toFixed(4)} rMGP</span>
        </div>
        <div className="flex justify-between">
          <span>Burn Rate:</span>
          <span className="text-green-400">1 rMGP = {burnRate.toFixed(4)} MGP</span>
        </div>
        <div className="flex justify-between">
          <span>Investment Period:</span>
          <span>{formatTime(withdrawalTime)}</span>
        </div>
        <div className="flex justify-between font-semibold">
          <span>ROI:</span>
          <span className="text-green-400">{fixedYieldPercent.toFixed(2)}%</span>
        </div>
        <div className="flex justify-between font-semibold">
          <span>APR:</span>
          <span className="text-green-400">{annualizedYield.toFixed(2)}%</span>
        </div>
      </div>
      <div className="mt-3 rounded bg-green-900/30 p-2 text-xs text-green-200">
        <strong>Example:</strong> Spend {formatEther(send ?? 0n).toFixed(2)} MGP → Get {(formatEther(send ?? 0n) / mgpRmgpCurveRate).toFixed(2)} rMGP → Withdraw {(formatEther(send ?? 0n) / mgpRmgpCurveRate * burnRate).toFixed(2)} MGP = +{(formatEther(send ?? 0n) / mgpRmgpCurveRate * burnRate - formatEther(send ?? 0n)).toFixed(2)} MGP profit
      </div>
    </div>

    <div className="mt-4 text-sm text-gray-400">
      <div className="mb-1 flex justify-between">
        <span>Variable MGP APR</span>
        <span>{Math.round(10_000 * mgpAPR) / 100}%</span>
      </div>
      <div className="mb-1 flex justify-between font-semibold">
        <span>Fixed Yield APR</span>
        <span className="text-green-400">{annualizedYield.toFixed(2)}%</span>
      </div>
    </div>
  </Page>;
});

FixedYieldPage.displayName = "FixedYieldPage";
