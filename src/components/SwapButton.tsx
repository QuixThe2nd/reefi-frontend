import { contracts, Chains, TradeableCoinExtended, TradeableCoinExtendedETH } from "../config/contracts";
import { formatEther } from "../utilities";
import { useAllowances } from "../state/useAllowances";

import { Button } from "./Button";
import { BuyOnCurve } from "./BuyOnCurve";
import { ReactElement } from "react";
import { TokenApproval } from "./TokenApproval";

interface Properties {
  buy: () => void;
  label: string;
  tokenIn: TradeableCoinExtendedETH | "vlMGP";
  tokenOut: TradeableCoinExtendedETH;
  mgpRmgpCurveAmount: bigint;
  rmgpYmgpCurveAmount: bigint;
  rmgpMgpCurveAmount: bigint;
  mgpYmgpCurveAmount: bigint;
  ymgpRmgpCurveAmount: bigint;
  ymgpMgpCurveAmount: bigint;
  allowances: ReturnType<typeof useAllowances>[0];
  send: bigint;
  ymgpVmgpCurveAmount: bigint;
  chain: Chains;
  lockedReefiMGP: bigint;
  rmgpSupply: bigint;
  approve: (_tokenOut: "rMGP" | "yMGP" | "cMGP" | "vMGP" | "odosRouter", _tokenIn: TradeableCoinExtended, _infinity: boolean) => void;
  convertMGP: () => void;
  sellYMGP: () => void;
  mintWETH: () => void;
  swap: (_tokenIn: `0x${string}`, _tokenOut: `0x${string}`) => void;
}

export const SwapButton = ({ buy, tokenIn, tokenOut, label, mgpRmgpCurveAmount, rmgpYmgpCurveAmount, rmgpMgpCurveAmount, mgpYmgpCurveAmount, ymgpRmgpCurveAmount, ymgpMgpCurveAmount, allowances, send, chain, approve, convertMGP, sellYMGP, mintWETH, swap, lockedReefiMGP, rmgpSupply, ymgpVmgpCurveAmount }: Properties): ReactElement => {
  if (tokenIn === "MGP" && tokenOut === "rMGP" || tokenIn === "rMGP" && tokenOut === "yMGP" || tokenIn === "yMGP" && tokenOut === "rMGP" || tokenIn === "rMGP" && tokenOut === "MGP" || tokenIn === "yMGP" && tokenOut === "vMGP" || tokenIn === "rMGP" && tokenOut === "wrMGP" || tokenIn === "wrMGP" && tokenOut === "rMGP" || tokenIn === "vlMGP" && tokenOut === "MGP") {
    let nativeRate = 1;
    let curveAmount = 0n;
    if (tokenIn === "MGP" && tokenOut === "rMGP") {
      nativeRate = lockedReefiMGP === 0n ? 1 : Number(rmgpSupply) / Number(lockedReefiMGP);
      curveAmount = mgpRmgpCurveAmount;
    } else if (tokenIn === "rMGP" && tokenOut === "MGP") {
      nativeRate = rmgpSupply === 0n ? 1 : Number(lockedReefiMGP) / Number(rmgpSupply);
      curveAmount = rmgpMgpCurveAmount;
    } else if (tokenIn === "yMGP" && tokenOut === "rMGP") {
      nativeRate = 0.75;
      curveAmount = ymgpRmgpCurveAmount;
    } else if (tokenIn === "yMGP" && tokenOut === "vMGP") curveAmount = ymgpVmgpCurveAmount;
    else if (tokenIn === "rMGP" && tokenOut === "wrMGP") nativeRate = rmgpSupply === 0n ? 1 : Number(lockedReefiMGP) / Number(rmgpSupply);
    else if (tokenIn === "wrMGP" && tokenOut === "rMGP") nativeRate = lockedReefiMGP === 0n ? 1 : Number(rmgpSupply) / Number(lockedReefiMGP);
    else if (tokenIn === "rMGP" && tokenOut === "yMGP") curveAmount = rmgpYmgpCurveAmount;
    return <div className={`grid ${curveAmount === 0n ? "" : "grid-cols-2"} gap-2`}>
      <div>
        {tokenOut !== "MGP" && tokenIn !== "yMGP" && tokenOut !== "rMGP" && <TokenApproval allowance={allowances[tokenIn]} onApprove={infinity => approve(tokenOut, tokenIn, infinity)} send={send} tokenSymbol={tokenIn} />}
        <Button className="w-full" onClick={buy} type="submit">{label} ({formatEther(BigInt(Math.round(Number(send) * nativeRate))).toFixed(4)} {tokenOut})</Button>
      </div>
      {curveAmount !== 0n && <BuyOnCurve allowanceCurve={allowances.curve[tokenIn]} buy={buy} curveAmount={curveAmount} nativeRate={nativeRate} onApprove={infinity => approve("cMGP", tokenIn, infinity)} send={send} tokenASymbol={tokenIn} tokenBSymbol={tokenOut} />}
    </div>;
  }
  if (tokenIn === "MGP" && tokenOut === "yMGP") return <BuyOnCurve allowanceCurve={allowances.curve[tokenIn]} buy={convertMGP} curveAmount={mgpYmgpCurveAmount} nativeRate={1} onApprove={infinity => {
    approve("cMGP", tokenIn, infinity);
  }} send={send} tokenASymbol={tokenIn} tokenBSymbol={tokenOut} />;
  if (tokenIn === "yMGP" && tokenOut === "rMGP") return <BuyOnCurve allowanceCurve={allowances.curve[tokenIn]} buy={sellYMGP} curveAmount={ymgpRmgpCurveAmount} nativeRate={1} onApprove={infinity => {
    approve("cMGP", tokenIn, infinity);
  }} send={send} tokenASymbol={tokenIn} tokenBSymbol={tokenOut} />;
  if (tokenIn === "yMGP" && tokenOut === "MGP") return <BuyOnCurve allowanceCurve={allowances.curve[tokenIn]} buy={sellYMGP} curveAmount={ymgpMgpCurveAmount} nativeRate={1 / Number(lockedReefiMGP) / Number(rmgpSupply) * 0.9} onApprove={infinity => {
    approve("cMGP", tokenIn, infinity);
  }} send={send} tokenASymbol={tokenIn} tokenBSymbol={tokenOut} />;

  return <>
    {tokenIn === "ETH" && <Button className="mb-2 w-full" variant="secondary" onClick={mintWETH} type="submit">Wrap ETH</Button>}
    {tokenIn === "WETH" && <TokenApproval allowance={allowances.odos[tokenIn]} onApprove={infinity => {
      approve("odosRouter", tokenIn, infinity);
    }} send={send} tokenSymbol={tokenIn} />}
    <Button className="w-full" variant="secondary" onClick={() => {
      swap(contracts[chain][tokenIn === "ETH" ? "WETH" : tokenIn].address, contracts[chain].MGP.address);
    }} type="submit">Swap to MGP With Odos</Button>
  </>;
};
