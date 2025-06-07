import { memo, type ReactElement } from "react";
import { useAllowances } from "../state/useAllowances";
import { useBalances } from "../state/useBalances";
import { usePrices } from "../state/usePrices";

import { Chains, TradeableCoinExtended } from "../config/contracts";
import { Page } from "../components/Page";
import { SwapToken } from "../components/SwapToken";

interface Properties {
  balances: ReturnType<typeof useBalances>[0];
  setSend: (_send: bigint) => void;
  send: bigint;
  prices: ReturnType<typeof usePrices>[0];
  ymgpMgpCurveRate: number;
  mgpRmgpCurveRate: number;
  mgpRmgpCurveAmount: bigint;
  rmgpYmgpCurveAmount: bigint;
  rmgpMgpCurveAmount: bigint;
  mgpYmgpCurveAmount: bigint;
  ymgpRmgpCurveAmount: bigint;
  ymgpVmgpCurveAmount: bigint;
  ymgpMgpCurveAmount: bigint;
  allowances: ReturnType<typeof useAllowances>[0];
  chain: Chains;
  lockedReefiMGP: bigint;
  rmgpSupply: bigint;
  approve: (_tokenOut: "rMGP" | "yMGP" | "vMGP" | "cMGP" | "odosRouter", _tokenIn: TradeableCoinExtended, _infinity: boolean) => void;
  convertMGP: () => void;
  sellYMGP: () => void;
  mintWETH: () => void;
  swap: (_tokenIn: `0x${string}`, _tokenOut: `0x${string}`) => void;
  buyYMGP: () => void;
  depositRMGP: () => void;
}

export const GetYMGPPage = memo(({ balances, setSend, send, prices, ymgpMgpCurveRate, mgpRmgpCurveRate, mgpRmgpCurveAmount, rmgpYmgpCurveAmount, ymgpVmgpCurveAmount, rmgpMgpCurveAmount, mgpYmgpCurveAmount, ymgpRmgpCurveAmount, ymgpMgpCurveAmount, allowances, chain, approve, convertMGP, sellYMGP, mintWETH, swap, buyYMGP, depositRMGP, lockedReefiMGP, rmgpSupply }: Properties): ReactElement => <Page info="yMGP is backed 1:1 by rMGP. 1 yMGP can be redeemed for 0.75 rMGP. yMGP alone has no additional benefit over rMGP, it must be locked for boosted yield.">
  <SwapToken buy={buyYMGP} excludeCoins={["CKP", "EGP", "PNP", "LTP", "WETH"]} label="Mint" nativeSwap={depositRMGP} originalTokenIn="rMGP" tokenOut="yMGP" balances={balances} setSend={setSend} send={send} prices={prices} ymgpMgpCurveRate={ymgpMgpCurveRate} mgpRmgpCurveRate={mgpRmgpCurveRate} mgpRmgpCurveAmount={mgpRmgpCurveAmount} rmgpYmgpCurveAmount={rmgpYmgpCurveAmount} rmgpMgpCurveAmount={rmgpMgpCurveAmount} mgpYmgpCurveAmount={mgpYmgpCurveAmount} ymgpRmgpCurveAmount={ymgpRmgpCurveAmount} ymgpMgpCurveAmount={ymgpMgpCurveAmount} allowances={allowances} chain={chain} approve={approve} convertMGP={convertMGP} sellYMGP={sellYMGP} mintWETH={mintWETH} swap={swap} lockedReefiMGP={lockedReefiMGP} rmgpSupply={rmgpSupply} ymgpVmgpCurveAmount={ymgpVmgpCurveAmount} />
</Page>);
GetYMGPPage.displayName = "ConvertPage";
