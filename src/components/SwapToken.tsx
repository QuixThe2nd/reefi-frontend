import { useGlobalContext } from "../contexts/GlobalContext";
import { useState, ReactElement } from "react";

import { Coins } from "../config/contracts";
import { SwapButton } from "./SwapButton";
import { SwapInput } from "./SwapInput";

export const SwapToken = ({ originalTokenIn, tokenOut, buy, nativeSwap, label, excludeCoins }: Readonly<{ originalTokenIn: Coins; tokenOut: Coins; buy: () => void; nativeSwap?: () => void; label?: string; excludeCoins: Coins[] }>): ReactElement => {
  const { amounts, balances } = useGlobalContext();
  const [tokenIn, setTokenIn] = useState<Coins | "ETH">(originalTokenIn);
  return <>
    <SwapInput balance={balances[tokenIn][0]} excludeCoins={excludeCoins} label={`Get ${tokenOut}`} onChange={amounts.setSend} onCoinChange={setTokenIn} outputCoin={tokenOut} selectedCoin={tokenIn} value={amounts.send} />
    <SwapButton buy={buy} label={label} nativeSwap={nativeSwap} tokenIn={tokenIn} tokenOut={tokenOut} />
  </>;
};
