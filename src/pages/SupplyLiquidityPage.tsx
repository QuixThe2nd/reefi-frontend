import { formatEther } from "../utilities";

import { AmountInput } from "../components/AmountInput";
import { Button } from "../components/Button";
import { Dispatch, memo, SetStateAction, type ReactElement } from "react";
import { Page } from "../components/Page";
import { PrimaryCoin } from "../config/contracts";

interface Properties {
  mgpBalance: bigint;
  rmgpBalance: bigint;
  ymgpBalance: bigint;
  setLPAmounts: Dispatch<SetStateAction<Record<PrimaryCoin, bigint>>>;
  mgpLPAmount: bigint;
  rmgpLPAmount: bigint;
  ymgpLPAmount: bigint;
  mgpCurveBalance: bigint;
  rmgpCurveBalance: bigint;
  ymgpCurveBalance: bigint;
  supplyLiquidity: () => void;
}

export const SupplyLiquidityPage = memo(({ mgpBalance, rmgpBalance, ymgpBalance, setLPAmounts, mgpLPAmount, rmgpLPAmount, ymgpLPAmount, mgpCurveBalance, rmgpCurveBalance, ymgpCurveBalance, supplyLiquidity }: Properties): ReactElement => <Page info='Supply liquidity to the cMGP Curve pool (MGP/rMGP/yMGP). You can supply liquidity at any ratio of MGP:rMGP:yMGP, however it is recommended you match the targets to prevent slippage. To stake or withdraw liquidity, use <a href="https://www.curve.finance/dex/arbitrum/pools/factory-stable-ng-179/withdraw/" className="text-blue-400">Curve</a>.'>
  <AmountInput balance={mgpBalance} label="Supply MGP"
    onChange={val => setLPAmounts(a => ({ ...a, MGP: val }))}
    placeholder={((): string => {
      const mgpTarget = mgpCurveBalance === 0n ? 0 : Number(mgpCurveBalance) / Number(mgpCurveBalance + rmgpCurveBalance + ymgpCurveBalance);
      const getTotalRecommendedLP = (): number => {
        let val = Number(rmgpLPAmount + ymgpLPAmount);
        if (rmgpLPAmount === 0n) val = Number(ymgpLPAmount) / (Number(ymgpCurveBalance) / Number(rmgpCurveBalance + ymgpCurveBalance));
        if (ymgpLPAmount === 0n) val = Number(rmgpLPAmount) / (Number(rmgpCurveBalance) / Number(rmgpCurveBalance + ymgpCurveBalance));
        if (Number.isNaN(val)) return 0;
        return val;
      };
      return formatEther(BigInt(getTotalRecommendedLP() * mgpTarget / (1 - mgpTarget))).toString();
    })()}
    token={{ symbol: "MGP" }}
    value={mgpLPAmount}
  />

  <div className="mb-4 flex justify-between text-sm text-gray-400">
    <span>Target</span>
    <span>{(100 * Number(mgpCurveBalance) / Number(mgpCurveBalance + rmgpCurveBalance + ymgpCurveBalance)).toFixed(0)}%</span>
  </div>

  <AmountInput
    balance={rmgpBalance}
    label="Supply rMGP"
    onChange={val => setLPAmounts(a => ({ ...a, rMGP: val }))}
    placeholder={((): string => {
      const rmgpTarget = rmgpCurveBalance === 0n ? 0 : Number(rmgpCurveBalance) / Number(mgpCurveBalance + rmgpCurveBalance + ymgpCurveBalance);
      const getTotalRecommendedLP = (): number => {
        let val = Number(rmgpLPAmount + ymgpLPAmount);
        if (mgpLPAmount === 0n) val = Number(ymgpLPAmount) / (Number(ymgpCurveBalance) / Number(mgpCurveBalance + ymgpCurveBalance));
        if (ymgpLPAmount === 0n) val = Number(mgpLPAmount) / (Number(mgpCurveBalance) / Number(mgpCurveBalance + ymgpCurveBalance));
        if (Number.isNaN(val)) return 0;
        return val;
      };
      return formatEther(BigInt(getTotalRecommendedLP() * rmgpTarget / (1 - rmgpTarget))).toString();
    })()}
    token={{ symbol: "rMGP" }}
    value={rmgpLPAmount}
  />

  <div className="mb-4 flex justify-between text-sm text-gray-400">
    <span>Target</span>
    <span>{(100 * Number(rmgpCurveBalance) / Number(mgpCurveBalance + rmgpCurveBalance + ymgpCurveBalance)).toFixed(0)}%</span>
  </div>

  <AmountInput
    balance={ymgpBalance}
    label="Supply yMGP"
    onChange={val => setLPAmounts(a => ({ ...a, yMGP: val }))}
    placeholder={((): string => {
      const ymgpTarget = ymgpCurveBalance === 0n ? 0 : Number(ymgpCurveBalance) / Number(mgpCurveBalance + rmgpCurveBalance + ymgpCurveBalance);
      const getTotalRecommendedLP = (): number => {
        let val = Number(rmgpLPAmount + ymgpLPAmount);
        if (rmgpLPAmount === 0n) val = Number(mgpLPAmount) / (Number(mgpCurveBalance) / Number(rmgpCurveBalance + mgpCurveBalance));
        if (mgpLPAmount === 0n) val = Number(rmgpLPAmount) / (Number(rmgpCurveBalance) / Number(rmgpCurveBalance + mgpCurveBalance));
        if (Number.isNaN(val)) return 0;
        return val;
      };
      return formatEther(BigInt(getTotalRecommendedLP() * ymgpTarget / (1 - ymgpTarget))).toString();
    })()}
    token={{ symbol: "yMGP" }}
    value={ymgpLPAmount}
  />
  <div className="mb-4 flex justify-between text-sm text-gray-400">
    <span>Target</span>
    <span>{(100 * Number(ymgpCurveBalance) / Number(mgpCurveBalance + rmgpCurveBalance + ymgpCurveBalance)).toFixed(0)}%</span>
  </div>
  <Button className="w-full" onClick={supplyLiquidity} type="submit">Get cMGP</Button>
</Page>);
SupplyLiquidityPage.displayName = "SupplyLiquidityPage";
