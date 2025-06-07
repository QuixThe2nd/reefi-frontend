import { memo, type ReactElement } from "react";
import { useBalances } from "../state/useBalances";

import { Chains, TradeableCoin } from "../config/contracts";
import { Page } from "../components/Page";
import { SwapToken } from "../components/SwapToken";
import { UseAllowances } from "../hooks/useAllowances";
import { UsePrices } from "../hooks/usePrices";

interface Properties {
  balances: ReturnType<typeof useBalances>[0];
  setSend: (_send: bigint) => void;
  send: bigint;
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
  lockedReefiMGP: bigint;
  rmgpSupply: bigint;
  approve: (_tokenOut: "rMGP" | "yMGP" | "vMGP" | "cMGP" | "odosRouter", _tokenIn: TradeableCoin, _infinity: boolean) => void;
  convertMGP: () => void;
  sellYMGP: () => void;
  mintWETH: () => void;
  swap: (_tokenIn: `0x${string}`, _tokenOut: `0x${string}`) => void;
  buyVMGP: () => void;
  mintVMGP: () => void;
}

export const GetVMGPPage = memo(({ balances, setSend, send, prices, ymgpMgpCurveRate, mgpRmgpCurveRate, mgpRmgpCurveAmount, rmgpYmgpCurveAmount, ymgpVmgpCurveAmount, rmgpMgpCurveAmount, mgpYmgpCurveAmount, ymgpRmgpCurveAmount, ymgpMgpCurveAmount, allowances, chain, approve, convertMGP, sellYMGP, mintWETH, swap, buyVMGP, mintVMGP, lockedReefiMGP, rmgpSupply }: Properties): ReactElement => <Page info="yMGP is backed 1:1 by rMGP. 1 yMGP can be redeemed for 0.75 rMGP. yMGP alone has no additional benefit over rMGP, it must be locked for boosted yield.">
  <SwapToken buy={buyVMGP} excludeCoins={["CKP", "EGP", "PNP", "LTP", "WETH"]} label="Mint" nativeSwap={mintVMGP} originalTokenIn="yMGP" tokenOut="vMGP" balances={balances} setSend={setSend} send={send} prices={prices} ymgpMgpCurveRate={ymgpMgpCurveRate} mgpRmgpCurveRate={mgpRmgpCurveRate} mgpRmgpCurveAmount={mgpRmgpCurveAmount} rmgpYmgpCurveAmount={rmgpYmgpCurveAmount} rmgpMgpCurveAmount={rmgpMgpCurveAmount} mgpYmgpCurveAmount={mgpYmgpCurveAmount} ymgpRmgpCurveAmount={ymgpRmgpCurveAmount} ymgpMgpCurveAmount={ymgpMgpCurveAmount} allowances={allowances} chain={chain} approve={approve} convertMGP={convertMGP} sellYMGP={sellYMGP} mintWETH={mintWETH} swap={swap} lockedReefiMGP={lockedReefiMGP} rmgpSupply={rmgpSupply} ymgpVmgpCurveAmount={ymgpVmgpCurveAmount} />
</Page>);
GetVMGPPage.displayName = "GetVMGPPage";
