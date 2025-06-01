import { memo, type ReactElement } from "react";
import { useGlobalContext } from "../contexts/GlobalContext";

import { Page } from "../components/Page";
import { SwapToken } from "../components/SwapToken";

export const GetYMGPPage = memo((): ReactElement => {
  const { actions } = useGlobalContext();

  return <Page info="yMGP is backed 1:1 by rMGP. This process can not be undone. yMGP alone has no additional benefit over rMGP, it must be locked for boosted yield.">
    <SwapToken buy={actions.buyYMGP} excludeCoins={["CKP", "EGP", "PNP", "LTP", "WETH"]} label="Mint" nativeSwap={actions.depositRMGP} originalTokenIn="rMGP" tokenOut="yMGP" />
  </Page>;
});
GetYMGPPage.displayName = "ConvertPage";
