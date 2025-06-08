/* eslint @typescript-eslint/no-unnecessary-condition: 0 */

import { contracts, Chains, AllCoinETH, AllCoin, CoreCoin, isPrimaryCoin, PrimaryCoin, CoreCoinExtended } from "../config/contracts";
import { formatEther } from "../utilities";
import { useAllowances } from "../state/useAllowances";
import { useAmounts } from "../state/useAmounts";
import { useBalances } from "../state/useBalances";
import { useSupplies } from "../state/useSupplies";

import { Button } from "./Button";
import { BuyOnCurve } from "./BuyOnCurve";
import { JSX, ReactElement } from "react";
import { TokenApproval } from "./TokenApproval";

interface Properties {
  label: string;
  tokenIn: AllCoinETH;
  tokenOut: AllCoinETH;
  send: bigint;
  chain: Chains;
  balances: ReturnType<typeof useBalances>[0];
  supplies: ReturnType<typeof useSupplies>[0];
  curveAmounts: ReturnType<typeof useAmounts>[0]["curve"];
  allowances: ReturnType<typeof useAllowances>[0];
  curveBuy: (_tokenIn: PrimaryCoin, _tokenOut: PrimaryCoin) => void;
  nativeSwap: undefined | ((_tokenIn: CoreCoin, _tokenOut: CoreCoin) => void);
  approve: (_tokenOut: "wstMGP" | "yMGP" | "cMGP" | "vMGP" | "odosRouter", _tokenIn: AllCoin, _infinity: boolean) => void;
  mintWETH: () => void;
  swap: (_tokenIn: `0x${string}`, _tokenOut: `0x${string}`) => void;
}

const exchangeRates = (tokenIn: CoreCoinExtended, tokenOut: CoreCoinExtended, balances: ReturnType<typeof useBalances>[0], supplies: ReturnType<typeof useSupplies>[0]): number => {
  if (tokenIn === "MGP" || tokenIn === "vlMGP" || tokenIn === "stMGP") {
    if (tokenOut === "MGP" || tokenOut === "vlMGP" || tokenOut === "stMGP") return 1;
    if (tokenOut === "wstMGP" || tokenOut === "yMGP" || tokenOut === "vMGP" || tokenOut === "lyMGP" || tokenOut === "lvMGP") return supplies.wstMGP === 0n ? 1 : Number(supplies.wstMGP) / Number(balances.wstMGP.MGP);
  } else if (tokenIn === "wstMGP" || tokenIn === "yMGP" || tokenIn === "lyMGP" || tokenIn === "vMGP" || tokenIn === "lvMGP") {
    if (tokenOut === "MGP" || tokenOut === "vlMGP" || tokenOut === "stMGP") return balances.wstMGP.MGP === 0n ? 1 : Number(balances.wstMGP.MGP) / Number(supplies.wstMGP);
    if (tokenOut === "wstMGP" || tokenOut === "yMGP" || tokenOut === "lyMGP" || tokenOut === "vMGP" || tokenOut === "lvMGP") return 1;
  }
  return 0;
};

export const SwapButton = ({ curveBuy, nativeSwap, tokenIn, tokenOut, label, curveAmounts, allowances, send, chain, approve, mintWETH, swap, balances, supplies }: Properties): ReactElement => {
  const buttons = [] as JSX.Element[];
  if (tokenIn === "MGP" && tokenOut === "wstMGP" || tokenIn === "wstMGP" && tokenOut === "yMGP" || tokenIn === "yMGP" && tokenOut === "vMGP" || tokenIn === "yMGP" && tokenOut === "wstMGP") {
    const nativeRate = exchangeRates(tokenIn, tokenOut, balances, supplies);
    buttons.push(<div>
      <TokenApproval allowance={allowances[tokenOut][tokenIn]} onApprove={infinity => approve(tokenOut, tokenIn, infinity)} send={send} tokenSymbol={tokenIn} />
      <Button className="w-full" onClick={() => nativeSwap?.(tokenIn, tokenOut)} type="submit">{label} ({formatEther(BigInt(Math.round(Number(send) * nativeRate))).toFixed(4)} {tokenOut})</Button>
    </div>);
    if (isPrimaryCoin(tokenIn) && isPrimaryCoin(tokenOut)) buttons.push(<BuyOnCurve allowanceCurve={allowances.cMGP[tokenIn]} buy={curveBuy} curveAmount={curveAmounts[tokenIn][tokenOut]} nativeRate={nativeRate} onApprove={infinity => approve("cMGP", tokenIn, infinity)} send={send} tokenIn={tokenIn} tokenOut={tokenOut} />);
  } else buttons.push(<>
    {tokenIn === "ETH" && <Button className="mb-2 w-full" variant="secondary" onClick={mintWETH} type="submit">Wrap ETH</Button>}
    {tokenIn === "WETH" && <TokenApproval allowance={allowances.odos[tokenIn]} onApprove={infinity => approve("odosRouter", tokenIn, infinity)} send={send} tokenSymbol={tokenIn} />}
    <Button className="w-full" variant="secondary" onClick={() => swap(contracts[chain][tokenIn === "ETH" ? "WETH" : tokenIn].address, contracts[chain].MGP.address)} type="submit">Swap to MGP With Odos</Button>
  </>);

  return <div className={`gap-2 grid grid-cols-${buttons.length}`}>{buttons}</div>;
};
