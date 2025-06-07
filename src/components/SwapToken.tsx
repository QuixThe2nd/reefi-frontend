import { useState, ReactElement } from "react";

import { Chains, TransferrableCoin } from "../config/contracts";
import { SwapButton } from "./SwapButton";
import { SwapInput } from "./SwapInput";
import { UseAllowances } from "../hooks/useAllowances";
import { UseAmounts } from "../hooks/useAmounts";
import { UsePrices } from "../hooks/usePrices";

interface Properties {
  originalTokenIn: TransferrableCoin;
  tokenOut: TransferrableCoin;
  buy: () => void;
  nativeSwap?: () => void;
  label: string;
  excludeCoins: TransferrableCoin[];
  setSend: (_send: bigint) => void;
  send: UseAmounts["amounts"]["send"];
  prices: UsePrices;
  ymgpMgpCurveRate: number;
  mgpRmgpCurveRate: number;
  ymgpVmgpCurveAmount: bigint;
  mgpRmgpCurveAmount: bigint;
  rmgpYmgpCurveAmount: bigint;
  rmgpMgpCurveAmount: bigint;
  mgpYmgpCurveAmount: bigint;
  ymgpRmgpCurveAmount: bigint;
  ymgpMgpCurveAmount: bigint;
  allowances: UseAllowances["allowances"];
  chain: Chains;
  approve: (_tokenOut: "rMGP" | "yMGP" | "cMGP" | "vMGP" | "odosRouter", _tokenIn: TransferrableCoin, _infinity: boolean) => void;
  convertMGP: () => void;
  sellYMGP: () => void;
  mintWETH: () => void;
  swap: (_tokenIn: `0x${string}`, _tokenOut: `0x${string}`) => void;
  balances: UseBalances["balances"];
  lockedReefiMGP: bigint;
  rmgpSupply: bigint;
}

export const SwapToken = ({ originalTokenIn, tokenOut, balances, buy, nativeSwap, label, excludeCoins, setSend, send, prices, ymgpMgpCurveRate, mgpRmgpCurveRate, mgpRmgpCurveAmount, rmgpYmgpCurveAmount, ymgpVmgpCurveAmount, rmgpMgpCurveAmount, mgpYmgpCurveAmount, ymgpRmgpCurveAmount, ymgpMgpCurveAmount, allowances, chain, approve, convertMGP, sellYMGP, mintWETH, swap, lockedReefiMGP, rmgpSupply }: Properties): ReactElement => {
  const [tokenIn, setTokenIn] = useState<TransferrableCoin>(originalTokenIn);
  return <>
    <SwapInput balance={balances[tokenIn]} excludeCoins={excludeCoins} label={`Get ${tokenOut}`} onChange={setSend} onCoinChange={setTokenIn} outputCoin={tokenOut} selectedCoin={tokenIn} value={send} prices={prices} ymgpMgpCurveRate={ymgpMgpCurveRate} mgpRmgpCurveRate={mgpRmgpCurveRate} />
    <SwapButton buy={buy} label={label} nativeSwap={nativeSwap} tokenIn={tokenIn} tokenOut={tokenOut} mgpRmgpCurveAmount={mgpRmgpCurveAmount} rmgpYmgpCurveAmount={rmgpYmgpCurveAmount} rmgpMgpCurveAmount={rmgpMgpCurveAmount} mgpYmgpCurveAmount={mgpYmgpCurveAmount} ymgpVmgpCurveAmount={ymgpVmgpCurveAmount} ymgpRmgpCurveAmount={ymgpRmgpCurveAmount} ymgpMgpCurveAmount={ymgpMgpCurveAmount} allowances={allowances} send={send} chain={chain} approve={approve} convertMGP={convertMGP} sellYMGP={sellYMGP} mintWETH={mintWETH} swap={swap} lockedReefiMGP={lockedReefiMGP} rmgpSupply={rmgpSupply} />
  </>;
};
