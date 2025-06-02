import { formatEther } from "../utilities";
import { memo, type ReactElement } from "react";

import { AmountInput } from "../components/AmountInput";
import { Button } from "../components/Button";
import { Page } from "../components/Page";

interface Properties {
  mgpBalance: bigint;
  rmgpBalance: bigint;
  ymgpBalance: bigint;
  setMgpLPAmount: (_value: bigint) => void;
  setRmgpLPAmount: (_value: bigint) => void;
  setYmgpLPAmount: (_value: bigint) => void;
  mgpLPAmount: bigint;
  rmgpLPAmount: bigint;
  ymgpLPAmount: bigint;
  mgpCurveBalance: bigint;
  rmgpCurveBalance: bigint;
  ymgpCurveBalance: bigint;
  supplyLiquidity: () => void;
}

export const SupplyLiquidityPage = memo(({ mgpBalance, rmgpBalance, ymgpBalance, setMgpLPAmount, mgpLPAmount, rmgpLPAmount, ymgpLPAmount, setRmgpLPAmount, setYmgpLPAmount, mgpCurveBalance, rmgpCurveBalance, ymgpCurveBalance, supplyLiquidity }: Properties): ReactElement => <Page info='Supply liquidity to the cMGP Curve pool (MGP/rMGP/yMGP). You can supply liquidity at any ratio of MGP:rMGP:yMGP, however it is recommended you match the targets to prevent slippage. To stake or withdraw liquidity, use <a href="https://www.curve.finance/dex/arbitrum/pools/factory-stable-ng-179/withdraw/" className="text-blue-400">Curve</a>.'>
  <AmountInput balance={mgpBalance} label="Supply MGP"
    onChange={setMgpLPAmount}
    placeholder={((): string => {
      const mgpTarget = Number(mgpCurveBalance) / Number(mgpCurveBalance + rmgpCurveBalance + ymgpCurveBalance);
      const getTotalRecommendedLP = (): number => {
        if (rmgpLPAmount === 0n) return Number(ymgpLPAmount) / (Number(ymgpCurveBalance) / Number(rmgpCurveBalance + ymgpCurveBalance));
        if (ymgpLPAmount === 0n) return Number(rmgpLPAmount) / (Number(rmgpCurveBalance) / Number(rmgpCurveBalance + ymgpCurveBalance));
        return Number(rmgpLPAmount + ymgpLPAmount);
      };
      return formatEther(BigInt(getTotalRecommendedLP() * mgpTarget / (1 - mgpTarget))).toString();
    })()}
    token={{ bgColor: "bg-blue-600", color: "bg-blue-400", symbol: "MGP" }}
    value={mgpLPAmount}
  />

  <div className="mb-4 flex justify-between text-sm text-gray-400">
    <span>Target</span>
    <span>{(100 * Number(mgpCurveBalance) / Number(mgpCurveBalance + rmgpCurveBalance + ymgpCurveBalance)).toFixed(0)}%</span>
  </div>

  <AmountInput
    balance={rmgpBalance}
    label="Supply rMGP"
    onChange={setRmgpLPAmount}
    placeholder={((): string => {
      const rmgpTarget = Number(rmgpCurveBalance) / Number(mgpCurveBalance + rmgpCurveBalance + ymgpCurveBalance);
      const getTotalRecommendedLP = (): number => {
        if (mgpLPAmount === 0n) return Number(ymgpLPAmount) / (Number(ymgpCurveBalance) / Number(mgpCurveBalance + ymgpCurveBalance));
        if (ymgpLPAmount === 0n) return Number(mgpLPAmount) / (Number(mgpCurveBalance) / Number(mgpCurveBalance + ymgpCurveBalance));
        return Number(rmgpLPAmount + ymgpLPAmount);
      };
      return formatEther(BigInt(getTotalRecommendedLP() * rmgpTarget / (1 - rmgpTarget))).toString();
    })()}
    token={{ bgColor: "bg-blue-600", color: "bg-blue-400", symbol: "rMGP" }}
    value={rmgpLPAmount}
  />

  <div className="mb-4 flex justify-between text-sm text-gray-400">
    <span>Target</span>
    <span>{(100 * Number(rmgpCurveBalance) / Number(mgpCurveBalance + rmgpCurveBalance + ymgpCurveBalance)).toFixed(0)}%</span>
  </div>

  <AmountInput
    balance={ymgpBalance}
    label="Supply yMGP"
    onChange={setYmgpLPAmount}
    placeholder={((): string => {
      const ymgpTarget = Number(ymgpCurveBalance) / Number(mgpCurveBalance + rmgpCurveBalance + ymgpCurveBalance);
      const getTotalRecommendedLP = (): number => {
        if (rmgpLPAmount === 0n) return Number(mgpLPAmount) / (Number(mgpCurveBalance) / Number(rmgpCurveBalance + mgpCurveBalance));
        if (mgpLPAmount === 0n) return Number(rmgpLPAmount) / (Number(rmgpCurveBalance) / Number(rmgpCurveBalance + mgpCurveBalance));
        return Number(rmgpLPAmount + ymgpLPAmount);
      };
      return formatEther(BigInt(getTotalRecommendedLP() * ymgpTarget / (1 - ymgpTarget))).toString();
    })()}
    token={{ bgColor: "bg-blue-600", color: "bg-blue-400", symbol: "yMGP" }}
    value={ymgpLPAmount}
  />
  <div className="mb-4 flex justify-between text-sm text-gray-400">
    <span>Target</span>
    <span>{(100 * Number(ymgpCurveBalance) / Number(mgpCurveBalance + rmgpCurveBalance + ymgpCurveBalance)).toFixed(0)}%</span>
  </div>
  <Button className="w-full" onClick={supplyLiquidity} type="submit">Get cMGP</Button>
</Page>);
SupplyLiquidityPage.displayName = "SupplyLiquidityPage";
