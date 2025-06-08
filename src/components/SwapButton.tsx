/* eslint @typescript-eslint/no-unnecessary-condition: 0 */

import { contracts, Chains, AllCoinETH, AllCoin, CoreCoin, isPrimaryCoin, PrimaryCoin } from "../config/contracts";
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
  nativeSwap: (_tokenIn: CoreCoin, _tokenOut: CoreCoin) => void;
  approve: (_tokenOut: "rMGP" | "yMGP" | "cMGP" | "vMGP" | "odosRouter", _tokenIn: AllCoin, _infinity: boolean) => void;
  mintWETH: () => void;
  swap: (_tokenIn: `0x${string}`, _tokenOut: `0x${string}`) => void;
}

const exchangeRates = (tokenIn: CoreCoin, tokenOut: CoreCoin, balances: ReturnType<typeof useBalances>[0], supplies: ReturnType<typeof useSupplies>[0]): number => {
  if (tokenIn === "MGP" || tokenIn === "vlMGP" || tokenIn === "wrMGP") {
    if (tokenOut === "MGP" || tokenOut === "vlMGP" || tokenOut === "wrMGP") return 1;
    if (tokenOut === "rMGP" || tokenOut === "yMGP" || tokenOut === "vMGP" || tokenOut === "lyMGP" || tokenOut === "lvMGP") return supplies.rMGP === 0n ? 1 : Number(supplies.rMGP) / Number(balances.rMGP.MGP);
  } else if (tokenIn === "rMGP" || tokenIn === "yMGP" || tokenIn === "lyMGP" || tokenIn === "vMGP" || tokenIn === "lvMGP") {
    if (tokenOut === "MGP" || tokenOut === "vlMGP" || tokenOut === "wrMGP") return balances.rMGP.MGP === 0n ? 1 : Number(balances.rMGP.MGP) / Number(supplies.rMGP);
    if (tokenOut === "rMGP" || tokenOut === "yMGP" || tokenOut === "lyMGP" || tokenOut === "vMGP" || tokenOut === "lvMGP") return 1;
  }
  return 0;
};

export const SwapButton = ({ curveBuy, nativeSwap, tokenIn, tokenOut, label, curveAmounts, allowances, send, chain, approve, mintWETH, swap, balances, supplies }: Properties): ReactElement => {
  const buttons = [] as JSX.Element[];
  if (tokenIn === "MGP" && tokenOut === "rMGP" || tokenIn === "rMGP" && tokenOut === "yMGP" || tokenIn === "yMGP" && tokenOut === "vMGP" || tokenIn === "yMGP" && tokenOut === "rMGP") {
    const nativeRate = exchangeRates(tokenIn, tokenOut, balances, supplies);
    buttons.push(<div>
      <TokenApproval allowance={allowances[tokenOut][tokenIn]} onApprove={infinity => approve(tokenOut, tokenIn, infinity)} send={send} tokenSymbol={tokenIn} />
      <Button className="w-full" onClick={() => nativeSwap(tokenIn, tokenOut)} type="submit">{label} ({formatEther(BigInt(Math.round(Number(send) * nativeRate))).toFixed(4)} {tokenOut})</Button>
    </div>);
    if (isPrimaryCoin(tokenIn) && isPrimaryCoin(tokenOut)) buttons.push(<BuyOnCurve allowanceCurve={allowances.cMGP[tokenIn]} buy={curveBuy} curveAmount={curveAmounts[tokenIn][tokenOut]} nativeRate={nativeRate} onApprove={infinity => approve("cMGP", tokenIn, infinity)} send={send} tokenIn={tokenIn} tokenOut={tokenOut} />);
  } else buttons.push(<>
    {tokenIn === "ETH" && <Button className="mb-2 w-full" variant="secondary" onClick={mintWETH} type="submit">Wrap ETH</Button>}
    {tokenIn === "WETH" && <TokenApproval allowance={allowances.odos[tokenIn]} onApprove={infinity => approve("odosRouter", tokenIn, infinity)} send={send} tokenSymbol={tokenIn} />}
    <Button className="w-full" variant="secondary" onClick={() => swap(contracts[chain][tokenIn === "ETH" ? "WETH" : tokenIn].address, contracts[chain].MGP.address)} type="submit">Swap to MGP With Odos</Button>
  </>);

  return <div className={`gap-2 grid grid-cols-${buttons.length}`}>{buttons}</div>;
};
