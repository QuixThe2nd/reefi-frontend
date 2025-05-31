import { ReactElement, useState } from "react"
import { formatEther } from "../utils"
import { Coins, contracts } from "../config/contracts"
import { useGlobalContext } from "../contexts/GlobalContext"
import { BuyOnCurve } from "./BuyOnCurve"
import { SwapInput } from "./SwapInput"
import { TokenApproval } from "./TokenApproval"

export const SwapToken = ({ originalTokenIn, tokenOut, nativeRate, curveAmount, buy, nativeSwap, label }: { originalTokenIn: Coins, tokenOut: Coins, nativeRate: number, curveAmount: bigint, buy: () => void, nativeSwap?: () => void, label?: string }): ReactElement => {
  const { actions, allowances, amounts, balances, wallet } = useGlobalContext()
  const [tokenIn, setTokenIn] = useState<Coins>(originalTokenIn)

  return <>
    <SwapInput label={`Get ${tokenOut}`} selectedCoin={tokenIn} onCoinChange={setTokenIn} balance={balances[tokenIn][0]} value={amounts.send} onChange={amounts.setSend} outputCoin={tokenOut} />
    {(tokenIn === 'MGP' && tokenOut ==='RMGP') || (tokenIn === 'RMGP' && tokenOut ==='YMGP') || (tokenIn === 'RMGP' && tokenOut ==='MGP') ? <div className="grid grid-cols-2 gap-2">
      <div>
        {tokenOut !=='MGP' && <TokenApproval sendAmount={amounts.send} allowance={allowances[tokenIn][0]} onApprove={infinity => actions.approve(tokenOut, tokenIn, infinity)} tokenSymbol={tokenIn} />}
        <button type="submit" className="py-2 rounded-lg transition-colors bg-green-600 hover:bg-green-700 h-min w-full" onClick={nativeSwap}>{label} ({formatEther(BigInt(Number(amounts.send)*nativeRate)).toFixed(4)} {tokenOut})</button>
      </div>
      <BuyOnCurve sendAmount={amounts.send} curveAmount={curveAmount} allowanceCurve={allowances.curve[tokenIn][0]} nativeRate={nativeRate} onApprove={infinity => actions.approve('CMGP', tokenIn, infinity)} buy={buy} tokenASymbol={tokenIn} tokenBSymbol={tokenOut} />
    </div> : <>
      <TokenApproval sendAmount={amounts.send} allowance={allowances.odos[tokenIn][0]} onApprove={infinity => actions.approve('ODOSRouter', tokenIn, infinity)} tokenSymbol={tokenIn} />
      <button type="submit" className="py-2 rounded-lg transition-colors bg-green-600 hover:bg-green-700 h-min w-full" onClick={() => actions.swap(contracts[wallet.chain][tokenIn].address, contracts[wallet.chain].MGP.address)}>Swap to MGP</button>
    </>}
  </>
}
