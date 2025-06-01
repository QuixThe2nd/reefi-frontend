import { formatEther } from "../utilities";
import { memo, type ReactElement } from "react";
import { useGlobalContext } from "../contexts/GlobalContext";

import { AmountInput } from "../components/AmountInput";
import { Page } from "../components/Page";

export const SupplyLiquidityPage = memo((): ReactElement => {
  const { actions, amounts, balances } = useGlobalContext();
  return <Page info='Supply liquidity to the cMGP Curve pool (MGP/rMGP/yMGP). You can supply liquidity at any ratio of MGP:rMGP:yMGP, however it is recommended you match the targets to prevent slippage. To stake or withdraw liquidity, use <a href="https://www.curve.finance/dex/arbitrum/pools/factory-stable-ng-179/withdraw/" className="text-blue-400">Curve</a>.'>
    <AmountInput
      balance={balances.MGP[0]}
      label="Supply MGP"
      onChange={amounts.setMGPLP}
      placeholder={((): string => {
        const mgpTarget = Number(balances.mgpCurve) / Number(balances.mgpCurve + balances.rmgpCurve + balances.ymgpCurve);
        const getTotalRecommendedLP = (): number => {
          if (amounts.rmgpLP === 0n) return Number(amounts.ymgpLP) / (Number(balances.ymgpCurve) / Number(balances.rmgpCurve + balances.ymgpCurve));
          if (amounts.ymgpLP === 0n) return Number(amounts.rmgpLP) / (Number(balances.rmgpCurve) / Number(balances.rmgpCurve + balances.ymgpCurve));
          return Number(amounts.rmgpLP + amounts.ymgpLP);
        };
        return formatEther(BigInt(getTotalRecommendedLP() * mgpTarget / (1 - mgpTarget))).toString();
      })()}
      token={{ bgColor: "bg-blue-600", color: "bg-blue-400", symbol: "MGP" }}
      value={amounts.mgpLP}
    />

    <div className="mb-4 flex justify-between text-sm text-gray-400">
      <span>Target</span>
      <span>{(100 * Number(balances.mgpCurve) / Number(balances.mgpCurve + balances.rmgpCurve + balances.ymgpCurve)).toFixed(0)}%</span>
    </div>

    <AmountInput
      balance={balances.rMGP[0]}
      label="Supply rMGP"
      onChange={amounts.setRMGPLP}
      placeholder={((): string => {
        const rmgpTarget = Number(balances.rmgpCurve) / Number(balances.mgpCurve + balances.rmgpCurve + balances.ymgpCurve);
        const getTotalRecommendedLP = (): number => {
          if (amounts.mgpLP === 0n) return Number(amounts.ymgpLP) / (Number(balances.ymgpCurve) / Number(balances.mgpCurve + balances.ymgpCurve));
          if (amounts.ymgpLP === 0n) return Number(amounts.mgpLP) / (Number(balances.mgpCurve) / Number(balances.mgpCurve + balances.ymgpCurve));
          return Number(amounts.rmgpLP + amounts.ymgpLP);
        };
        return formatEther(BigInt(getTotalRecommendedLP() * rmgpTarget / (1 - rmgpTarget))).toString();
      })()}
      token={{ bgColor: "bg-green-600", color: "bg-green-400", symbol: "rMGP" }}
      value={amounts.rmgpLP}
    />

    <div className="mb-4 flex justify-between text-sm text-gray-400">
      <span>Target</span>
      <span>{(100 * Number(balances.rmgpCurve) / Number(balances.mgpCurve + balances.rmgpCurve + balances.ymgpCurve)).toFixed(0)}%</span>
    </div>

    <AmountInput
      balance={balances.yMGP[0]}
      label="Supply yMGP"
      onChange={amounts.setYMGPLP}
      placeholder={((): string => {
        const ymgpTarget = Number(balances.ymgpCurve) / Number(balances.mgpCurve + balances.rmgpCurve + balances.ymgpCurve);
        const getTotalRecommendedLP = (): number => {
          if (amounts.rmgpLP === 0n) return Number(amounts.mgpLP) / (Number(balances.mgpCurve) / Number(balances.rmgpCurve + balances.mgpCurve));
          if (amounts.mgpLP === 0n) return Number(amounts.rmgpLP) / (Number(balances.rmgpCurve) / Number(balances.rmgpCurve + balances.mgpCurve));
          return Number(amounts.rmgpLP + amounts.ymgpLP);
        };
        return formatEther(BigInt(getTotalRecommendedLP() * ymgpTarget / (1 - ymgpTarget))).toString();
      })()}
      token={{ bgColor: "bg-green-600", color: "bg-green-400", symbol: "yMGP" }}
      value={amounts.ymgpLP}
    />
    <div className="mb-4 flex justify-between text-sm text-gray-400">
      <span>Target</span>
      <span>{(100 * Number(balances.ymgpCurve) / Number(balances.mgpCurve + balances.rmgpCurve + balances.ymgpCurve)).toFixed(0)}%</span>
    </div>
    <button className="w-full py-2 rounded-lg transition-colors bg-green-600 hover:bg-green-700 h-min}" onClick={actions.supplyLiquidity} type="submit">Get cMGP</button>
  </Page>;
});
SupplyLiquidityPage.displayName = "SupplyLiquidityPage";
