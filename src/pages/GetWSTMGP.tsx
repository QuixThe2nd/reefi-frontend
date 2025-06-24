import { Page } from "../components/Page";
import { SwapToken } from "../components/SwapToken";

import type { ApproveFunction } from "../actions/approve";
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
  readonly balances: ReturnType<typeof useBalances>;
  readonly send: bigint;
  readonly allowances: ReturnType<typeof useAllowances>;
  readonly approve: ApproveFunction;
  readonly mintWETH: (_writeContract: UseWriteContractReturnType<typeof wagmiConfig>["writeContract"]) => void;
  readonly setSend: (_send: bigint) => void;
  readonly nativeSwap: (_tokenIn: CoreCoin, _tokenOut: CoreCoin, _writeContract: UseWriteContractReturnType<typeof wagmiConfig>["writeContract"]) => void;
  readonly curveAmounts: ReturnType<typeof useAmounts>[0]["curve"];
  readonly supplies: ReturnType<typeof useSupplies>;
  readonly odosBuy: BuyOnOdos;
  readonly curveBuy: BuyOnCurve;
}

export const GetWSTMGP = ({ balances, setSend, send, allowances, approve, mintWETH, curveAmounts, supplies, nativeSwap, odosBuy, curveBuy }: Properties): ReactElement => <Page info={<span>stMGP can be wrapped for wstMGP. 1 stMGP receives 1 vlMGP worth of wstMGP.</span>} noTopMargin>
  <SwapToken allowances={allowances} approve={approve} balances={balances} curveAmounts={curveAmounts} curveBuy={curveBuy} excludeCoins={["CKP", "PNP", "EGP", "LTP", "WETH", "MGP", "wstMGP", "yMGP", "vMGP", "ETH", "cMGP", "syMGP", "vlMGP", "rMGP", "bMGP"]} label="Wrap" mintWETH={mintWETH} nativeSwap={nativeSwap} odosBuy={odosBuy} originalTokenIn="stMGP" send={send} setSend={setSend} supplies={supplies} tokenOut="wstMGP" />
</Page>;
