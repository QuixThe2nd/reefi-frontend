import { contracts, Coins, Chains } from "../config/contracts";
import { formatEther } from "../utilities";

import { Button } from "./Button";
import { BuyOnCurve } from "./BuyOnCurve";
import { ReactElement } from "react";
import { TokenApproval } from "./TokenApproval";
import { UseAllowances } from "../hooks/useAllowances";

interface Properties {
  buy: () => void;
  nativeSwap: undefined | (() => void);
  label: string | undefined;
  tokenIn: Coins | "ETH";
  tokenOut: Coins;
  mgpRmgpCurveAmount: bigint;
  rmgpYmgpCurveAmount: bigint;
  rmgpMgpCurveAmount: bigint;
  mgpYmgpCurveAmount: bigint;
  ymgpRmgpCurveAmount: bigint;
  ymgpMgpCurveAmount: bigint;
  allowances: UseAllowances["allowances"];
  sendAmount: bigint;
  chain: Chains;
  lockedReefiMGP: bigint;
  rmgpSupply: bigint;
  approve: (_tokenOut: "rMGP" | "yMGP" | "cMGP" | "ODOSRouter", _tokenIn: Coins, _infinity: boolean) => void;
  convertMGP: () => void;
  sellYMGP: () => void;
  mintWETH: () => void;
  swap: (_tokenIn: `0x${string}`, _tokenOut: `0x${string}`) => void;
}

export const SwapButton = ({ buy, nativeSwap, label, tokenIn, tokenOut, mgpRmgpCurveAmount, rmgpYmgpCurveAmount, rmgpMgpCurveAmount, mgpYmgpCurveAmount, ymgpRmgpCurveAmount, ymgpMgpCurveAmount, allowances, sendAmount, chain, approve, convertMGP, sellYMGP, mintWETH, swap, lockedReefiMGP, rmgpSupply }: Properties): ReactElement => {
  if (tokenIn === "MGP" && tokenOut === "rMGP" || tokenIn === "rMGP" && tokenOut === "yMGP" || tokenIn === "rMGP" && tokenOut === "MGP") {
    let nativeRate = 1;
    let curveAmount = 0n;
    if (tokenIn === "MGP" && tokenOut === "rMGP") {
      nativeRate = Number(rmgpSupply) / Number(lockedReefiMGP);
      curveAmount = mgpRmgpCurveAmount;
    } else if (tokenIn === "rMGP" && tokenOut === "MGP") {
      nativeRate = Number(lockedReefiMGP) / Number(rmgpSupply) * 0.9;
      curveAmount = rmgpMgpCurveAmount;
    } else if (tokenIn === "rMGP" && tokenOut === "yMGP") curveAmount = rmgpYmgpCurveAmount;
    return <div className="grid grid-cols-2 gap-2">
      <div>
        {tokenOut !== "MGP" && <TokenApproval allowance={allowances[tokenIn]} onApprove={infinity => approve(tokenOut, tokenIn, infinity)} sendAmount={sendAmount} tokenSymbol={tokenIn} />}
        <Button className="w-full" onClick={nativeSwap} type="submit">{label} ({formatEther(BigInt(Number(sendAmount) * nativeRate)).toFixed(4)} {tokenOut})</Button>
      </div>
      <BuyOnCurve allowanceCurve={allowances.curve[tokenIn]} buy={buy} curveAmount={curveAmount} nativeRate={nativeRate} onApprove={infinity => approve("cMGP", tokenIn, infinity)} sendAmount={sendAmount} tokenASymbol={tokenIn} tokenBSymbol={tokenOut} />
    </div>;
  }
  if (tokenIn === "MGP" && tokenOut === "yMGP") return <BuyOnCurve allowanceCurve={allowances.curve[tokenIn]} buy={convertMGP} curveAmount={mgpYmgpCurveAmount} nativeRate={1} onApprove={infinity => approve("cMGP", tokenIn, infinity)} sendAmount={sendAmount} tokenASymbol={tokenIn} tokenBSymbol={tokenOut} />;
  if (tokenIn === "yMGP" && tokenOut === "rMGP") return <BuyOnCurve allowanceCurve={allowances.curve[tokenIn]} buy={sellYMGP} curveAmount={ymgpRmgpCurveAmount} nativeRate={1} onApprove={infinity => approve("cMGP", tokenIn, infinity)} sendAmount={sendAmount} tokenASymbol={tokenIn} tokenBSymbol={tokenOut} />;
  if (tokenIn === "yMGP" && tokenOut === "MGP") return <BuyOnCurve allowanceCurve={allowances.curve[tokenIn]} buy={sellYMGP} curveAmount={ymgpMgpCurveAmount} nativeRate={1 / Number(lockedReefiMGP) / Number(rmgpSupply) * 0.9} onApprove={infinity => approve("cMGP", tokenIn, infinity)} sendAmount={sendAmount} tokenASymbol={tokenIn} tokenBSymbol={tokenOut} />;

  return <>
    {tokenIn === "ETH" && <Button className="mb-2 w-full" variant="secondary" onClick={mintWETH} type="submit">Wrap ETH</Button>}
    {tokenIn === "WETH" && <TokenApproval allowance={allowances.odos[tokenIn]} onApprove={infinity => approve("ODOSRouter", tokenIn, infinity)} sendAmount={sendAmount} tokenSymbol={tokenIn} />}
    <Button className="w-full" variant="secondary" onClick={() => swap(contracts[chain][tokenIn === "ETH" ? "WETH" : tokenIn].address, contracts[chain].MGP.address)} type="submit">Swap to MGP With Odos</Button>
  </>;
};
