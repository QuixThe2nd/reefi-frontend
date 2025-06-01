import { aprToApy } from "../utilities";
import { memo, type ReactElement } from "react";
import { useGlobalContext } from "../contexts/GlobalContext";

import { Page } from "../components/Page";
import { SwapToken } from "../components/SwapToken";

export const GetRMGPPage = memo((): ReactElement => {
  const { actions, amounts, rewards } = useGlobalContext();
  return <Page info="MGP can be converted to rMGP to earn auto compounded yield. Yield is accrued from vlMGP SubDAO Rewards.">
    <SwapToken buy={actions.buyRMGP} curveAmount={amounts.mgpRmgpCurve} excludeCoins={["CKP", "PNP", "EGP", "LTP", "WETH"]} label="Mint" nativeSwap={actions.depositMGP} originalTokenIn="MGP" tokenOut="rMGP" />
    <div className="mt-4 text-sm text-gray-400">
      <div className="mb-1 flex justify-between">
        <span>Original APR</span>
        <span>{Math.round(10_000 * rewards.mgpAPR) / 100}%</span>
      </div>
      <div className="mb-1 flex justify-between">
        <span>Reward APY</span>
        <span>{Math.round(10_000 * aprToApy(rewards.mgpAPR) * 0.9) / 100}%</span>
      </div>
    </div>
  </Page>;
});
GetRMGPPage.displayName = "GetRMGPPage";
