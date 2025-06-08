import { memo, type ReactElement } from "react";
import { useAllowances } from "../state/useAllowances";
import { useAmounts } from "../state/useAmounts";
import { useBalances } from "../state/useBalances";
import { useSupplies } from "../state/useSupplies";

import { Chains, AllCoin, CoreCoin, PrimaryCoin } from "../config/contracts";
import { Page } from "../components/Page";
import { SwapToken } from "../components/SwapToken";

interface Properties {
  balances: ReturnType<typeof useBalances>[0];
  setSend: (_send: bigint) => void;
  send: bigint;
  allowances: ReturnType<typeof useAllowances>[0];
  chain: Chains;
  approve: (_tokenOut: "rMGP" | "yMGP" | "vMGP" | "cMGP" | "odosRouter", _tokenIn: AllCoin, _infinity: boolean) => void;
  mintWETH: () => void;
  swap: (_tokenIn: `0x${string}`, _tokenOut: `0x${string}`) => void;
  curveBuy: (_tokenIn: PrimaryCoin, _tokenOut: PrimaryCoin) => void;
  nativeSwap: (_tokenIn: CoreCoin, _tokenOut: CoreCoin) => void;
  curveAmounts: ReturnType<typeof useAmounts>[0]["curve"];
  supplies: ReturnType<typeof useSupplies>[0];
}

export const GetWRMGPPage = memo(({ balances, setSend, send, allowances, chain, approve, mintWETH, swap, curveAmounts, supplies, curveBuy, nativeSwap }: Properties): ReactElement => <Page info="rMGP can be wrapped as wrMGP. 1 wrMGP represents 1 vlMGP but earns no yield. wrMGP can be bridged cross-chain." noTopMargin={true}>
  <SwapToken excludeCoins={["CKP", "PNP", "EGP", "LTP", "WETH"]} label="Wrap" originalTokenIn="rMGP" tokenOut="wrMGP" balances={balances} setSend={setSend} send={send} allowances={allowances} chain={chain} approve={approve} mintWETH={mintWETH} swap={swap} curveAmounts={curveAmounts} supplies={supplies} curveBuy={curveBuy} nativeSwap={nativeSwap} />
</Page>);
GetWRMGPPage.displayName = "GetWRMGPPage";
