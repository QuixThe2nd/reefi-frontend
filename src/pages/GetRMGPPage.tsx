import { aprToApy } from "../utilities";
import { memo, type ReactElement } from "react";
import { useAllowances } from "../state/useAllowances";
import { useAmounts } from "../state/useAmounts";
import { useBalances } from "../state/useBalances";
import { useSupplies } from "../state/useSupplies";

import { Page } from "../components/Page";
import { PrimaryCoin, AllCoinETH, Chains, CoreCoin } from "../config/contracts";
import { SwapToken } from "../components/SwapToken";

interface Properties {
  mgpAPR: number;
  send: bigint;
  chain: Chains;
  balances: ReturnType<typeof useBalances>[0];
  allowances: ReturnType<typeof useAllowances>[0];
  curveAmounts: ReturnType<typeof useAmounts>[0]["curve"];
  supplies: ReturnType<typeof useSupplies>[0];
  depositMGP: () => void;
  setSend: (_send: bigint) => void;
  curveBuy: (_tokenIn: PrimaryCoin, _tokenOut: PrimaryCoin) => void;
  nativeSwap: (_tokenIn: CoreCoin, _tokenOut: CoreCoin) => void;
  approve: (_tokenOut: "wstMGP" | "yMGP" | "vMGP" | "cMGP" | "odosRouter", _tokenIn: AllCoinETH, _infinity: boolean) => void;
  mintWETH: () => void;
  swap: (_tokenIn: `0x${string}`, _tokenOut: `0x${string}`) => void;
}

export const GetRMGPPage = memo(({ mgpAPR, balances, setSend, send, allowances, chain, curveBuy, nativeSwap, approve, mintWETH, swap, curveAmounts, supplies }: Properties): ReactElement => <Page info="MGP can be converted to wstMGP to earn auto compounded yield. Yield is accrued from vlMGP SubDAO Rewards.">
  <SwapToken label="Mint" originalTokenIn="MGP" tokenOut="wstMGP" balances={balances} setSend={setSend} send={send} allowances={allowances} chain={chain} approve={approve} mintWETH={mintWETH} swap={swap} excludeCoins={["CKP", "PNP", "EGP", "LTP", "lvMGP", "lyMGP", "vlMGP", "WETH", "ETH", "cMGP", "stMGP", "vMGP", "yMGP"]} curveBuy={curveBuy} nativeSwap={nativeSwap} curveAmounts={curveAmounts} supplies={supplies} />
  <div className="mt-4 text-sm text-gray-400">
    <div className="mb-1 flex justify-between">
      <span>Original APR</span>
      <span>{Math.round(10_000 * mgpAPR) / 100}%</span>
    </div>
    <div className="mb-1 flex justify-between">
      <span>Reward APY</span>
      <span>{Math.round(10_000 * aprToApy(mgpAPR) * 0.9) / 100}%</span>
    </div>
  </div>
</Page>);
GetRMGPPage.displayName = "GetRMGPPage";
