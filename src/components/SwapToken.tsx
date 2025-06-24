import { useState, type ReactElement } from "react";

import { SwapButton } from "./SwapButton";
import { SwapInput } from "./SwapInput";

import type { AllCoin, CoreCoin, SecondaryCoin, CurveCoin } from "../state/useContracts";
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
  readonly excludeCoins: AllCoin[];
  readonly label: string;
  readonly send: bigint;
  readonly curveAmounts: ReturnType<typeof useAmounts>[0]["curve"];
  readonly allowances: ReturnType<typeof useAllowances>;
  readonly balances: ReturnType<typeof useBalances>;
  readonly supplies: ReturnType<typeof useSupplies>;
  readonly curveBuy: BuyOnCurve;
  readonly nativeSwap: undefined | ((_tokenIn: CoreCoin, _tokenOut: CoreCoin, _writeContract: UseWriteContractReturnType<typeof wagmiConfig>["writeContract"]) => void);
  readonly setSend: (_send: bigint) => void;
  readonly approve: ApproveFunction;
  readonly mintWETH: (_writeContract: UseWriteContractReturnType<typeof wagmiConfig>["writeContract"]) => void;
  readonly originalTokenIn: CurveCoin | SecondaryCoin | "wstMGP";
  readonly tokenOut: "wstMGP" | "WETH" | "ETH" | "bMGP" | CurveCoin;
  readonly odosBuy: BuyOnOdos;
}

export const SwapToken = ({ balances, curveBuy, nativeSwap = undefined, label, excludeCoins, setSend, send, curveAmounts, allowances, approve, mintWETH, supplies, originalTokenIn, tokenOut, odosBuy }: Properties): ReactElement => {
  const [tokenIn, setTokenIn] = useState(originalTokenIn);
  return <>
    <SwapInput balance={balances.user[tokenIn]} excludeCoins={[...excludeCoins, tokenOut]} label={`Get ${tokenOut}`} onChange={setSend} onCoinChange={setTokenIn} selectedCoin={tokenIn} value={send} />
    <SwapButton allowances={allowances} approve={approve} balances={balances} curveAmounts={curveAmounts} curveBuy={curveBuy} label={label} mintWETH={mintWETH} nativeSwap={nativeSwap} odosBuy={odosBuy} send={send} supplies={supplies} tokenIn={tokenIn} tokenOut={tokenOut} />
  </>;
};
