import { memo, type ReactElement } from "react";

import { Chains, TransferrableCoin } from "../config/contracts";
import { Page } from "../components/Page";
import { SwapToken } from "../components/SwapToken";
import { UseAllowances } from "../hooks/useAllowances";
import { UseAmounts } from "../hooks/useAmounts";
import { UsePrices } from "../hooks/usePrices";

interface Properties {
  depositMGP: () => void;
  balances: UseBalances["balances"];
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
  ymgpVmgpCurveAmount: bigint;
  ymgpMgpCurveAmount: bigint;
  allowances: UseAllowances["allowances"];
  chain: Chains;
  lockedReefiMGP: bigint;
  rmgpSupply: bigint;
  unwrapWRMGP: () => void;
  approve: (_tokenOut: "rMGP" | "yMGP" | "vMGP" | "cMGP" | "odosRouter", _tokenIn: TransferrableCoin, _infinity: boolean) => void;
  convertMGP: () => void;
  sellYMGP: () => void;
  mintWETH: () => void;
  swap: (_tokenIn: `0x${string}`, _tokenOut: `0x${string}`) => void;
}

export const UnwrapWRMGPPage = memo(({ depositMGP, balances, setSend, send, prices, ymgpMgpCurveRate, mgpRmgpCurveRate, mgpRmgpCurveAmount, rmgpYmgpCurveAmount, rmgpMgpCurveAmount, mgpYmgpCurveAmount, ymgpVmgpCurveAmount, ymgpRmgpCurveAmount, ymgpMgpCurveAmount, allowances, chain, unwrapWRMGP, approve, convertMGP, sellYMGP, mintWETH, swap, lockedReefiMGP, rmgpSupply }: Properties): ReactElement => <Page info="wrMGP can be unwrapped for rMGP. 1 wrMGP receives 1 vlMGP worth of rMGP. wrMGP can be unwrapped on any chain." noTopMargin={true}>
  <SwapToken buy={unwrapWRMGP} excludeCoins={["CKP", "PNP", "EGP", "LTP", "WETH", "MGP", "rMGP", "yMGP", "vMGP", "lyMGP", "lvMGP"]} label="Unwrap" nativeSwap={depositMGP} originalTokenIn="wrMGP" tokenOut="rMGP" balances={balances} setSend={setSend} send={send} prices={prices} ymgpMgpCurveRate={ymgpMgpCurveRate} mgpRmgpCurveRate={mgpRmgpCurveRate} mgpRmgpCurveAmount={mgpRmgpCurveAmount} rmgpYmgpCurveAmount={rmgpYmgpCurveAmount} rmgpMgpCurveAmount={rmgpMgpCurveAmount} mgpYmgpCurveAmount={mgpYmgpCurveAmount} ymgpRmgpCurveAmount={ymgpRmgpCurveAmount} ymgpMgpCurveAmount={ymgpMgpCurveAmount} allowances={allowances} chain={chain} approve={approve} convertMGP={convertMGP} sellYMGP={sellYMGP} mintWETH={mintWETH} swap={swap} lockedReefiMGP={lockedReefiMGP} rmgpSupply={rmgpSupply} ymgpVmgpCurveAmount={ymgpVmgpCurveAmount} />
</Page>);
UnwrapWRMGPPage.displayName = "UnwrapWRMGPPage";
