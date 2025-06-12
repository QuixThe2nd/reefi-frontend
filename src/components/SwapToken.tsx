import { useState, type ReactElement } from "react";

import { SwapButton } from "./SwapButton";
import { SwapInput } from "./SwapInput";

import type { Chains, AllCoinETH, CoreCoin, PrimaryCoin, TransferrableCoin } from "../config/contracts";
import type { UseSendTransactionReturnType, UseWriteContractReturnType } from "wagmi";
import type { useAllowances } from "../state/useAllowances";
import type { useAmounts } from "../state/useAmounts";
import type { useBalances } from "../state/useBalances";
import type { useSupplies } from "../state/useSupplies";
import type { wagmiConfig } from "..";

interface Properties {
  readonly originalTokenIn: AllCoinETH;
  readonly tokenOut: AllCoinETH;
  readonly excludeCoins: AllCoinETH[];
  readonly label: string;
  readonly send: bigint;
  readonly chain: Chains;
  readonly curveAmounts: ReturnType<typeof useAmounts>[0]["curve"];
  readonly allowances: ReturnType<typeof useAllowances>;
  readonly balances: ReturnType<typeof useBalances>;
  readonly supplies: ReturnType<typeof useSupplies>;
  readonly curveBuy?: (_tokenIn: PrimaryCoin, _tokenOut: PrimaryCoin, _writeContract: UseWriteContractReturnType<typeof wagmiConfig>["writeContract"]) => void;
  readonly nativeSwap?: (_tokenIn: CoreCoin, _tokenOut: CoreCoin, _writeContract: UseWriteContractReturnType<typeof wagmiConfig>["writeContract"]) => void;
  readonly setSend: (_send: bigint) => void;
  readonly approve: (_coin: TransferrableCoin, _spender: "wstMGP" | "yMGP" | "vMGP" | "cMGP" | "odosRouter", _infinity: boolean, _writeContract: UseWriteContractReturnType<typeof wagmiConfig>["writeContract"]) => void;
  readonly mintWETH: (_writeContract: UseWriteContractReturnType<typeof wagmiConfig>["writeContract"]) => void;
  readonly swap: (_tokenIn: `0x${string}`, _tokenOut: `0x${string}`, _sendTransaction: UseSendTransactionReturnType<typeof wagmiConfig>["sendTransaction"]) => void;
}

export const SwapToken = ({ originalTokenIn, tokenOut, balances, curveBuy = undefined, nativeSwap = undefined, label, excludeCoins, setSend, send, curveAmounts, allowances, chain, approve, mintWETH, swap, supplies }: Properties): ReactElement => {
  const [tokenIn, setTokenIn] = useState<AllCoinETH | "vlMGP">(originalTokenIn);
  return <>
    <SwapInput balance={balances.user[tokenIn]} excludeCoins={[...excludeCoins, tokenOut]} label={`Get ${tokenOut}`} onChange={setSend} onCoinChange={setTokenIn} selectedCoin={tokenIn} value={send} />
    <SwapButton allowances={allowances} approve={approve} balances={balances} chain={chain} curveAmounts={curveAmounts} curveBuy={curveBuy} label={label} mintWETH={mintWETH} nativeSwap={nativeSwap} send={send} supplies={supplies} swap={swap} tokenIn={tokenIn} tokenOut={tokenOut} />
  </>;
};
