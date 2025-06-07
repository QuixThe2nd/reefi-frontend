import { useAllowances } from "../state/useAllowances";
import { useBalances } from "../state/useBalances";
import { usePrices } from "../state/usePrices";
import { useState, ReactElement } from "react";

import { Chains, TradeableCoinExtended, TradeableCoinExtendedETH } from "../config/contracts";
import { SwapButton } from "./SwapButton";
import { SwapInput } from "./SwapInput";

interface Properties {
  originalTokenIn: TradeableCoinExtendedETH | "vlMGP";
  tokenOut: TradeableCoinExtendedETH;
  buy: () => void;
  nativeSwap?: () => void;
  label: string;
  excludeCoins: TradeableCoinExtendedETH[];
  setSend: (_send: bigint) => void;
  send: bigint;
  prices: ReturnType<typeof usePrices>[0];
  ymgpMgpCurveRate: number;
  mgpRmgpCurveRate: number;
  ymgpVmgpCurveAmount: bigint;
  mgpRmgpCurveAmount: bigint;
  rmgpYmgpCurveAmount: bigint;
  rmgpMgpCurveAmount: bigint;
  mgpYmgpCurveAmount: bigint;
  ymgpRmgpCurveAmount: bigint;
  ymgpMgpCurveAmount: bigint;
  allowances: ReturnType<typeof useAllowances>[0];
  chain: Chains;
  approve: (_tokenOut: "rMGP" | "yMGP" | "cMGP" | "vMGP" | "odosRouter", _tokenIn: TradeableCoinExtended, _infinity: boolean) => void;
  convertMGP: () => void;
  sellYMGP: () => void;
  mintWETH: () => void;
  swap: (_tokenIn: `0x${string}`, _tokenOut: `0x${string}`) => void;
  balances: ReturnType<typeof useBalances>[0];
  lockedReefiMGP: bigint;
  rmgpSupply: bigint;
}

export const SwapToken = ({ originalTokenIn, tokenOut, balances, buy, nativeSwap, label, excludeCoins, setSend, send, prices, ymgpMgpCurveRate, mgpRmgpCurveRate, mgpRmgpCurveAmount, rmgpYmgpCurveAmount, ymgpVmgpCurveAmount, rmgpMgpCurveAmount, mgpYmgpCurveAmount, ymgpRmgpCurveAmount, ymgpMgpCurveAmount, allowances, chain, approve, convertMGP, sellYMGP, mintWETH, swap, lockedReefiMGP, rmgpSupply }: Properties): ReactElement => {
  const [tokenIn, setTokenIn] = useState<TradeableCoinExtendedETH | "vlMGP">(originalTokenIn);
  return <>
    <SwapInput balance={balances.user[tokenIn]} excludeCoins={excludeCoins} label={`Get ${tokenOut}`} onChange={setSend} onCoinChange={setTokenIn} outputCoin={tokenOut} selectedCoin={tokenIn} value={send} prices={prices} ymgpMgpCurveRate={ymgpMgpCurveRate} mgpRmgpCurveRate={mgpRmgpCurveRate} />
    <SwapButton buy={buy} label={label} nativeSwap={nativeSwap} tokenIn={tokenIn} tokenOut={tokenOut} mgpRmgpCurveAmount={mgpRmgpCurveAmount} rmgpYmgpCurveAmount={rmgpYmgpCurveAmount} rmgpMgpCurveAmount={rmgpMgpCurveAmount} mgpYmgpCurveAmount={mgpYmgpCurveAmount} ymgpVmgpCurveAmount={ymgpVmgpCurveAmount} ymgpRmgpCurveAmount={ymgpRmgpCurveAmount} ymgpMgpCurveAmount={ymgpMgpCurveAmount} allowances={allowances} send={send} chain={chain} approve={approve} convertMGP={convertMGP} sellYMGP={sellYMGP} mintWETH={mintWETH} swap={swap} lockedReefiMGP={lockedReefiMGP} rmgpSupply={rmgpSupply} />
  </>;
};
