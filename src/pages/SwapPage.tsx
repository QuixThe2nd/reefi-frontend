import { use, type JSX } from "react";

import { Page } from "../components/Page";
import { ReefiContext, type wagmiConfig } from "..";
import { SwapToken } from "../components/SwapToken";

import type { AllCoin, CoreCoin } from "../state/useContracts";
import type { ApproveFunction } from "../actions/approve";
import type { BuyOnCurve } from "../actions/buyOnCurve";
import type { BuyOnOdos } from "../actions/buyOnOdos";
import type { UseWriteContractReturnType } from "wagmi";

interface Properties {
  readonly approve: ApproveFunction;
  readonly mintWETH: (_writeContract: UseWriteContractReturnType<typeof wagmiConfig>["writeContract"]) => void;
  readonly curveBuy: BuyOnCurve;
  readonly nativeSwap: (_tokenIn: CoreCoin, _tokenOut: CoreCoin, _writeContract: UseWriteContractReturnType<typeof wagmiConfig>["writeContract"]) => void;
  readonly odosBuy: BuyOnOdos;
  readonly info: JSX.Element | JSX.Element[];
  readonly secondaryToken?: AllCoin;
  readonly tokensIn: [AllCoin, ...AllCoin[]];
  readonly tokenOut: AllCoin;
}

export const SwapPage = ({ approve, mintWETH, curveBuy, nativeSwap, odosBuy, info, tokensIn, tokenOut, secondaryToken }: Properties) => {
  const { amounts, amountsActions, allowances, balances, supplies } = use(ReefiContext);
  return <Page info={info}>
    <SwapToken allowances={allowances} approve={approve} balances={balances} curveAmounts={amounts.curve} curveBuy={curveBuy} label="Mint" mintWETH={mintWETH} nativeSwap={nativeSwap} odosBuy={odosBuy} secondaryToken={secondaryToken} send={amounts.send} setSend={amountsActions.setSend} supplies={supplies} tokenOut={tokenOut} tokensIn={tokensIn} />
  </Page>;
};
