import { Page } from "../components/Page";
import { SwapToken } from "../components/SwapToken";

import type { ApproveFunction } from "../actions/approve";
import type { BuyOnCurve } from "../actions/buyOnCurve";
import type { BuyOnOdos } from "../actions/buyOnOdos";
import type { Chains, CoreCoin } from "../state/useContracts";
import type { ReactElement } from "react";
import type { UseWriteContractReturnType } from "wagmi";
import type { useAllowances } from "../state/useAllowances";
import type { useAmounts } from "../state/useAmounts";
import type { useBalances } from "../state/useBalances";
import type { useSupplies } from "../state/useSupplies";
import type { wagmiConfig } from "..";

interface Properties {
  readonly balances: ReturnType<typeof useBalances>;
  readonly setSend: (_send: bigint) => void;
  readonly send: bigint;
  readonly allowances: ReturnType<typeof useAllowances>;
  readonly chain: Chains;
  readonly approve: ApproveFunction;
  readonly mintWETH: (_writeContract: UseWriteContractReturnType<typeof wagmiConfig>["writeContract"]) => void;
  readonly curveBuy: BuyOnCurve;
  readonly nativeSwap: (_tokenIn: CoreCoin, _tokenOut: CoreCoin, _writeContract: UseWriteContractReturnType<typeof wagmiConfig>["writeContract"]) => void;
  readonly curveAmounts: ReturnType<typeof useAmounts>[0]["curve"];
  readonly supplies: ReturnType<typeof useSupplies>;
  readonly odosBuy: BuyOnOdos;
}

export const GetYMGP = ({ balances, setSend, send, allowances, chain, approve, mintWETH, curveAmounts, supplies, curveBuy, nativeSwap, odosBuy }: Properties): ReactElement => <Page info={<span>yMGP is backed 1:1 by wstMGP. 1 yMGP can be redeemed for 0.75 wstMGP. yMGP alone has no additional benefit over wstMGP, it must be locked for boosted yield.</span>}>
  <SwapToken allowances={allowances} approve={approve} balances={balances} chain={chain} curveAmounts={curveAmounts} curveBuy={curveBuy} excludeCoins={["CKP", "EGP", "PNP", "LTP", "WETH", "ETH", "cMGP", "stMGP", "vlMGP", "MGP", "vMGP", "syMGP", "rMGP", "bMGP"]} label="Mint" mintWETH={mintWETH} nativeSwap={nativeSwap} odosBuy={odosBuy} originalTokenIn="wstMGP" send={send} setSend={setSend} supplies={supplies} tokenOut="yMGP" />
</Page>;
