import { useAllowances } from "../state/useAllowances";
import { useAmounts } from "../state/useAmounts";
import { useBalances } from "../state/useBalances";
import { useState, ReactElement } from "react";
import { useSupplies } from "../state/useSupplies";

import { Chains, AllCoinETH, AllCoin, CoreCoin } from "../config/contracts";
import { SwapButton } from "./SwapButton";
import { SwapInput } from "./SwapInput";

interface Properties {
  originalTokenIn: AllCoinETH;
  tokenOut: AllCoinETH;
  excludeCoins: AllCoinETH[];
  label: string;
  send: bigint;
  chain: Chains;
  curveAmounts: ReturnType<typeof useAmounts>[0]["curve"];
  allowances: ReturnType<typeof useAllowances>[0];
  balances: ReturnType<typeof useBalances>[0];
  supplies: ReturnType<typeof useSupplies>[0];
  curveBuy: (_tokenIn: AllCoin, _tokenOut: CoreCoin) => void;
  nativeSwap: (_tokenIn: CoreCoin, _tokenOut: CoreCoin) => void;
  setSend: (_send: bigint) => void;
  approve: (_tokenOut: "rMGP" | "yMGP" | "cMGP" | "vMGP" | "odosRouter", _tokenIn: AllCoin, _infinity: boolean) => void;
  mintWETH: () => void;
  swap: (_tokenIn: `0x${string}`, _tokenOut: `0x${string}`) => void;
}

export const SwapToken = ({ originalTokenIn, tokenOut, balances, curveBuy, nativeSwap, label, excludeCoins, setSend, send, curveAmounts, allowances, chain, approve, mintWETH, swap, supplies }: Properties): ReactElement => {
  const [tokenIn, setTokenIn] = useState<AllCoinETH | "vlMGP">(originalTokenIn);
  return <>
    <SwapInput balance={balances.user[tokenIn]} excludeCoins={[...excludeCoins, tokenOut]} label={`Get ${tokenOut}`} onChange={setSend} onCoinChange={setTokenIn} selectedCoin={tokenIn} value={send} />
    <SwapButton curveBuy={curveBuy} nativeSwap={nativeSwap} label={label} tokenIn={tokenIn} tokenOut={tokenOut} curveAmounts={curveAmounts} allowances={allowances} send={send} chain={chain} approve={approve} mintWETH={mintWETH} swap={swap} balances={balances} supplies={supplies} />
  </>;
};
