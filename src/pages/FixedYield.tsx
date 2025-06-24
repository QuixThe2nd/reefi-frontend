import { formatEther, formatTime } from "../utilities";

import { Page } from "../components/Page";
import { SwapToken } from "../components/SwapToken";

import type { ApproveFunction } from "../actions/approve";
import type { Bond } from "../state/useBonds";
import type { BuyOnCurve } from "../actions/buyOnCurve";
import type { BuyOnOdos } from "../actions/buyOnOdos";
import type { CoreCoin } from "../state/useContracts";
import type { ReactElement } from "react";
import type { UseWriteContractReturnType } from "wagmi";
import type { useAllowances } from "../state/useAllowances";
import type { useAmounts } from "../state/useAmounts";
import type { useBalances } from "../state/useBalances";
import type { useSupplies } from "../state/useSupplies";
import type { wagmiConfig } from "..";

interface Properties {
  readonly mgpAPR: number;
  readonly balances: ReturnType<typeof useBalances>;
  readonly setSend: (_send: bigint) => void;
  readonly send: bigint;
  readonly mgpRmgpCurveRate: number;
  readonly mgpRmgpCurveAmount: bigint;
  readonly allowances: ReturnType<typeof useAllowances>;
  readonly lockedReefiMGP: bigint;
  readonly rmgpSupply: bigint;
  readonly approve: ApproveFunction;
  readonly mintWETH: (_writeContract: UseWriteContractReturnType<typeof wagmiConfig>["writeContract"]) => void;
  readonly curveBuy: BuyOnCurve;
  readonly nativeSwap: (_tokenIn: CoreCoin, _tokenOut: CoreCoin, _writeContract: UseWriteContractReturnType<typeof wagmiConfig>["writeContract"]) => void;
  readonly curveAmounts: ReturnType<typeof useAmounts>[0]["curve"];
  readonly supplies: ReturnType<typeof useSupplies>;
  readonly odosBuy: BuyOnOdos;
  readonly bonds: readonly Bond[];
}

export const FixedYield = ({ mgpAPR, balances, setSend, send, mgpRmgpCurveRate, mgpRmgpCurveAmount, allowances, approve, mintWETH, lockedReefiMGP, rmgpSupply, curveAmounts, supplies, curveBuy, nativeSwap, odosBuy, bonds }: Properties): ReactElement => {
  const burnRate = Number(rmgpSupply) / Number(lockedReefiMGP);
  const fixedYieldPercent = (Number(mgpRmgpCurveAmount) / Number(send) / burnRate - 1) * 100;
  const withdrawalTime = bonds.length === 6 ? Number(bonds[0]?.endTime) - Date.now() / 1000 + 60 * 60 * 24 * 30 * 2 : 60 * 60 * 24 * 30 * 2;
  const daysToWithdraw = withdrawalTime / (60 * 60 * 24);
  const annualizedYield = fixedYieldPercent / 100 * (365 / daysToWithdraw) * 100;

  return <Page info={[<span key="swap">Swap MGP to wstMGP under the peg, then immediately submit for withdrawal to earn guaranteed yield and wait 60-120 days.</span>, <span key="strategy">This strategy monetizes the wstMGP depeg by capturing the difference between market price and the burn rate.</span>, <span key="yield">The yield is fixed and known upfront, unlike variable staking yields that can change over time.</span>]}>
    <SwapToken allowances={allowances} approve={approve} balances={balances} curveAmounts={curveAmounts} curveBuy={curveBuy} excludeCoins={["CKP", "PNP", "EGP", "LTP", "WETH", "yMGP", "ETH", "cMGP", "wstMGP", "vMGP", "syMGP", "vlMGP", "rMGP", "bMGP"]} label="Buy & Withdraw" mintWETH={mintWETH} nativeSwap={nativeSwap} odosBuy={odosBuy} originalTokenIn="MGP" send={send} setSend={setSend} supplies={supplies} tokenOut="stMGP" />
    <div className="mt-4 rounded-lg border border-green-700 bg-green-900/20 p-4">
      <h3 className="mb-2 text-lg font-semibold text-green-400">🎯 Earn Fixed Yield</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Market Rate:</span>
          <span className="text-red-400">1 MGP = {mgpRmgpCurveRate.toFixed(4)} wstMGP</span>
        </div>
        <div className="flex justify-between">
          <span>Burn Rate:</span>
          <span className="text-green-400">1 wstMGP = {burnRate.toFixed(4)} MGP</span>
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
      <div className="mt-3 rounded bg-green-900/30 p-2 text-xs text-green-200">Example: Spend {formatEther(send).toFixed(2)} MGP → Get {(formatEther(send) / mgpRmgpCurveRate).toFixed(2)} wstMGP → Withdraw {(formatEther(send) / mgpRmgpCurveRate * burnRate).toFixed(2)} MGP = +{(formatEther(send) / mgpRmgpCurveRate * burnRate - formatEther(send)).toFixed(2)} MGP profit</div>
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
};
