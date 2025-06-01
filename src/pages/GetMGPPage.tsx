import { memo, type ReactElement } from "react";
import { useGlobalContext } from "../contexts/GlobalContext";

import { Page } from "../components/Page";
import { SwapToken } from "../components/SwapToken";

export const GetMGPPage = memo((): ReactElement => {
  const { actions, rewards } = useGlobalContext();
  return <Page info="MGP is Magpie's governance token. All Reefi derivatives are built around MGP.">
    <SwapToken buy={actions.buyRMGP} excludeCoins={["rMGP", "yMGP"]} originalTokenIn='WETH' tokenOut="MGP" />
    <div className="mt-4 text-sm text-gray-400">
      <div className="mb-1 flex justify-between">
        <span>Original APR</span>
        <span>0%</span>
      </div>
      <div className="mb-1 flex justify-between">
        <span>Locked APR</span>
        <span>{Math.round(10_000 * rewards.mgpAPR) / 100}%</span>
      </div>
    </div>
  </Page>;
});
GetMGPPage.displayName = "GetMGPPage";
