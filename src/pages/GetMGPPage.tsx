import { memo, type ReactElement } from "react";
import { useAllowances } from "../state/useAllowances";
import { useAmounts } from "../state/useAmounts";
import { useBalances } from "../state/useBalances";
import { useSupplies } from "../state/useSupplies";

import { Chains, AllCoin, CoreCoin, PrimaryCoin } from "../config/contracts";
import { Page } from "../components/Page";
import { SwapToken } from "../components/SwapToken";

interface Properties {
  mgpAPR: number;
  setSend: (_send: bigint) => void;
  send: bigint;
  allowances: ReturnType<typeof useAllowances>[0];
  chain: Chains;
  approve: (_tokenOut: "rMGP" | "yMGP" | "vMGP" | "cMGP" | "odosRouter", _tokenIn: AllCoin, _infinity: boolean) => void;
  mintWETH: () => void;
  swap: (_tokenIn: `0x${string}`, _tokenOut: `0x${string}`) => void;
  balances: ReturnType<typeof useBalances>[0];
  curveBuy: (_tokenIn: PrimaryCoin, _tokenOut: PrimaryCoin) => void;
  nativeSwap: (_tokenIn: CoreCoin, _tokenOut: CoreCoin) => void;
  curveAmounts: ReturnType<typeof useAmounts>[0]["curve"];
  supplies: ReturnType<typeof useSupplies>[0];
}

export const GetMGPPage = memo(({ balances, mgpAPR, setSend, send, allowances, chain, approve, mintWETH, swap, curveAmounts, supplies, curveBuy, nativeSwap }: Properties): ReactElement => <Page info="MGP is Magpie's governance token. All Reefi derivatives are built around MGP.">
  <SwapToken balances={balances} excludeCoins={["rMGP", "yMGP", "vMGP", "lyMGP", "lvMGP", "wrMGP", "vlMGP", "cMGP"]} originalTokenIn='WETH' tokenOut="MGP" label="Swap" setSend={setSend} send={send} allowances={allowances} chain={chain} approve={approve} mintWETH={mintWETH} swap={swap} curveAmounts={curveAmounts} supplies={supplies} curveBuy={curveBuy} nativeSwap={nativeSwap} />
  <div className="mt-4 text-sm text-gray-400">
    <div className="mb-1 flex justify-between">
      <span>Original APR</span>
      <span>0%</span>
    </div>
    <div className="mb-1 flex justify-between">
      <span>Locked APR</span>
      <span>{Math.round(10_000 * mgpAPR) / 100}%</span>
    </div>
  </div>
</Page>);
GetMGPPage.displayName = "GetMGPPage";
