import { memo, type ReactElement } from "react";

import { Chains, Coins } from "../config/contracts";
import { Page } from "../components/Page";
import { SwapToken } from "../components/SwapToken";
import { UseAllowances } from "../hooks/useAllowances";
import { UseAmounts } from "../hooks/useAmounts";
import { UseBalances } from "../hooks/useBalances";
import { UsePrices } from "../hooks/usePrices";

interface Properties {
  mgpAPR: number;
  setSend: (_send: bigint) => void;
  send: UseAmounts["amounts"]["send"];
  prices: UsePrices;
  ymgpMgpCurveRate: number;
  mgpRmgpCurveRate: number;
  mgpRmgpCurveAmount: bigint;
  rmgpYmgpCurveAmount: bigint;
  rmgpMgpCurveAmount: bigint;
  mgpYmgpCurveAmount: bigint;
  ymgpRmgpCurveAmount: bigint;
  ymgpMgpCurveAmount: bigint;
  ymgpVmgpCurveAmount: bigint;
  allowances: UseAllowances["allowances"];
  chain: Chains;
  buyMGP: () => void;
  approve: (_tokenOut: "rMGP" | "yMGP" | "vMGP" | "cMGP" | "odosRouter", _tokenIn: TransferrableCoin, _infinity: boolean) => void;
  convertMGP: () => void;
  sellYMGP: () => void;
  mintWETH: () => void;
  swap: (_tokenIn: `0x${string}`, _tokenOut: `0x${string}`) => void;
  balances: UseBalances["balances"];
  lockedReefiMGP: bigint;
  rmgpSupply: bigint;
}

export const GetMGPPage = memo(({ balances, mgpAPR, setSend, send, prices, ymgpMgpCurveRate, mgpRmgpCurveRate, mgpRmgpCurveAmount, ymgpVmgpCurveAmount, rmgpYmgpCurveAmount, rmgpMgpCurveAmount, mgpYmgpCurveAmount, ymgpRmgpCurveAmount, ymgpMgpCurveAmount, allowances, chain, buyMGP, approve, convertMGP, sellYMGP, mintWETH, swap, lockedReefiMGP, rmgpSupply }: Properties): ReactElement => <Page info="MGP is Magpie's governance token. All Reefi derivatives are built around MGP.">
  <SwapToken balances={balances} buy={buyMGP} excludeCoins={["rMGP", "yMGP"]} originalTokenIn='WETH' tokenOut="MGP" label="Swap" setSend={setSend} send={send} prices={prices} ymgpMgpCurveRate={ymgpMgpCurveRate} mgpRmgpCurveRate={mgpRmgpCurveRate} mgpRmgpCurveAmount={mgpRmgpCurveAmount} rmgpYmgpCurveAmount={rmgpYmgpCurveAmount} rmgpMgpCurveAmount={rmgpMgpCurveAmount} mgpYmgpCurveAmount={mgpYmgpCurveAmount} ymgpRmgpCurveAmount={ymgpRmgpCurveAmount} ymgpMgpCurveAmount={ymgpMgpCurveAmount} allowances={allowances} chain={chain} approve={approve} convertMGP={convertMGP} sellYMGP={sellYMGP} mintWETH={mintWETH} swap={swap} lockedReefiMGP={lockedReefiMGP} rmgpSupply={rmgpSupply} ymgpVmgpCurveAmount={ymgpVmgpCurveAmount} />
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
