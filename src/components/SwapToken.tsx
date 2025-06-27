import { useState, type ReactElement } from "react";

import { AmountOutput } from "./AmountOutput";
import { SwapButton } from "./SwapButton";
import { SwapInput } from "./SwapInput";

import type { AllCoin, CoreCoin } from "../state/useContracts";
import type { ApproveFunction } from "../actions/approve";
import type { BuyOnCurve } from "../actions/buyOnCurve";
import type { BuyOnOdos } from "../actions/buyOnOdos";
import type { UseWriteContractReturnType } from "wagmi";
import type { useAllowances } from "../state/useAllowances";
import type { useAmounts } from "../state/useAmounts";
import type { useBalances } from "../state/useBalances";
import type { useSupplies } from "../state/useSupplies";
import type { wagmiConfig } from "..";

interface Properties {
  readonly label: string;
  readonly send: bigint;
  readonly curveAmounts: ReturnType<typeof useAmounts>[0]["curve"];
  readonly allowances: ReturnType<typeof useAllowances>;
  readonly balances: ReturnType<typeof useBalances>;
  readonly supplies: ReturnType<typeof useSupplies>;
  readonly curveBuy: BuyOnCurve;
  readonly nativeSwap: (_tokenIn: CoreCoin, _tokenOut: CoreCoin, _writeContract: UseWriteContractReturnType<typeof wagmiConfig>["writeContract"]) => void;
  readonly setSend: (_send: bigint) => void;
  readonly approve: ApproveFunction;
  readonly mintWETH: (_writeContract: UseWriteContractReturnType<typeof wagmiConfig>["writeContract"]) => void;
  readonly tokensIn: [AllCoin, ...AllCoin[]];
  readonly tokenOut: AllCoin;
  readonly odosBuy: BuyOnOdos;
}

export const SwapToken = ({ balances, curveBuy, nativeSwap, label, setSend, send, curveAmounts, allowances, approve, mintWETH, supplies, tokensIn, tokenOut: originalTokenOut, odosBuy }: Properties): ReactElement => {
  const [tokenIn, setTokenIn] = useState(tokensIn[0]);
  const [tokenOut, setTokenOut] = useState(originalTokenOut);

  const handleChange = () => {
    const newTokenIn = tokenOut;
    setTokenOut(tokenIn);
    setTokenIn(newTokenIn);
  };

  return <>
    <SwapInput balance={balances.user[tokenIn]} inputCoins={tokensIn} label={`Deposit ${tokenIn}`} onChange={setSend} value={send} />
    <button className="flex justify-center py-4 w-full hover:scale-120 transition-transform" onClick={handleChange} type="button">
      <svg aria-hidden="true" className="size-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 14l-7 7m0 0l-7-7m7 7V3" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} /></svg>
    </button>
    <AmountOutput balance={balances.user[tokenOut]} label={`Get ${tokenOut}`} token={{ symbol: tokenOut }} />
    <SwapButton allowances={allowances} approve={approve} balances={balances} curveAmounts={curveAmounts} curveBuy={curveBuy} label={label} mintWETH={mintWETH} nativeSwap={nativeSwap} odosBuy={odosBuy} send={send} supplies={supplies} tokenIn={tokenIn} tokenOut={tokenOut} />
  </>;
};
