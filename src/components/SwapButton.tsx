import { contracts, Coins } from "../config/contracts";
import { formatEther } from "../utilities";
import { useGlobalContext } from "../contexts/GlobalContext";

import { BuyOnCurve } from "./BuyOnCurve";
import { ReactElement } from "react";
import { TokenApproval } from "./TokenApproval";

export const SwapButton = ({ buy, nativeSwap, label, tokenIn, tokenOut }: Readonly<{ buy: () => void; nativeSwap: undefined | (() => void); label: string | undefined; tokenIn: Coins | "ETH"; tokenOut: Coins }>): ReactElement => {
  const { actions, allowances, amounts, wallet, exchangeRates } = useGlobalContext();
  if (tokenIn === "MGP" && tokenOut === "rMGP" || tokenIn === "rMGP" && tokenOut === "yMGP" || tokenIn === "rMGP" && tokenOut === "MGP") {
    let nativeRate = 1;
    let curveAmount = 0n;
    if (tokenIn === "MGP" && tokenOut === "rMGP") {
      nativeRate = 1 / exchangeRates.mintRMGP;
      curveAmount = amounts.mgpRmgpCurve;
    } else if (tokenIn === "rMGP" && tokenOut === "MGP") {
      nativeRate = exchangeRates.mintRMGP * 0.9;
      curveAmount = amounts.rmgpMgpCurve;
    } else if (tokenIn === "rMGP" && tokenOut === "yMGP") curveAmount = amounts.rmgpYmgpCurve;
    return <div className="grid grid-cols-2 gap-2">
      <div>
        {tokenOut !== "MGP" && <TokenApproval allowance={allowances[tokenIn][0]} onApprove={infinity => actions.approve(tokenOut, tokenIn, infinity)} sendAmount={amounts.send} tokenSymbol={tokenIn} />}
        <button className="h-min w-full rounded-lg bg-green-600 py-2 text-xs transition-colors hover:bg-green-700 md:text-base" onClick={nativeSwap} type="submit">{label} ({formatEther(BigInt(Number(amounts.send) * nativeRate)).toFixed(4)} {tokenOut})</button>
      </div>
      <BuyOnCurve allowanceCurve={allowances.curve[tokenIn][0]} buy={buy} curveAmount={curveAmount} nativeRate={nativeRate} onApprove={infinity => actions.approve("cMGP", tokenIn, infinity)} sendAmount={amounts.send} tokenASymbol={tokenIn} tokenBSymbol={tokenOut} />
    </div>;
  }
  if (tokenIn === "MGP" && tokenOut === "yMGP") return <BuyOnCurve allowanceCurve={allowances.curve[tokenIn][0]} buy={actions.convertMGP} curveAmount={amounts.mgpYmgpCurve} nativeRate={1} onApprove={infinity => actions.approve("cMGP", tokenIn, infinity)} sendAmount={amounts.send} tokenASymbol={tokenIn} tokenBSymbol={tokenOut} />;
  if (tokenIn === "yMGP" && tokenOut === "rMGP") return <BuyOnCurve allowanceCurve={allowances.curve[tokenIn][0]} buy={actions.sellYMGP} curveAmount={amounts.ymgpRmgpCurve} nativeRate={1} onApprove={infinity => actions.approve("cMGP", tokenIn, infinity)} sendAmount={amounts.send} tokenASymbol={tokenIn} tokenBSymbol={tokenOut} />;
  if (tokenIn === "yMGP" && tokenOut === "MGP") return <BuyOnCurve allowanceCurve={allowances.curve[tokenIn][0]} buy={actions.sellYMGP} curveAmount={amounts.ymgpMgpCurve} nativeRate={1 / exchangeRates.mintRMGP * 0.9} onApprove={infinity => actions.approve("cMGP", tokenIn, infinity)} sendAmount={amounts.send} tokenASymbol={tokenIn} tokenBSymbol={tokenOut} />;
  if (tokenIn === "ETH") return <button className="h-min w-full rounded-lg bg-green-600 py-2 text-xs transition-colors hover:bg-green-700 md:text-base" onClick={() => actions.mintWETH()} type="submit">Mint WETH</button>;

  return <>
    <TokenApproval allowance={allowances.odos[tokenIn][0]} onApprove={infinity => actions.approve("ODOSRouter", tokenIn, infinity)} sendAmount={amounts.send} tokenSymbol={tokenIn} />
    <button className="h-min w-full rounded-lg bg-green-600 py-2 text-xs transition-colors hover:bg-green-700 md:text-base" onClick={() => actions.swap(contracts[wallet.chain][tokenIn].address, contracts[wallet.chain].MGP.address)} type="submit">Swap to MGP With Odos</button>
  </>;
};
