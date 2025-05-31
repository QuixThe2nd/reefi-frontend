import { ReactElement } from "react"
import { Coins, contracts } from "../config/contracts"
import { useGlobalContext } from "../contexts/GlobalContext"
import { formatEther } from "../utils"
import { BuyOnCurve } from "./BuyOnCurve"
import { TokenApproval } from "./TokenApproval"

export const SwapButton = ({ buy, nativeSwap, label, tokenIn, tokenOut }: { buy: () => void, nativeSwap: undefined | (() => void), label: string | undefined, tokenIn: Coins | 'ETH', tokenOut: Coins }): ReactElement => {
  const { actions, allowances, amounts, wallet, exchangeRates } = useGlobalContext()
  if ((tokenIn === 'MGP' && tokenOut ==='rMGP') || (tokenIn === 'rMGP' && tokenOut ==='yMGP') || (tokenIn === 'rMGP' && tokenOut ==='MGP')) {
    const nativeRate = tokenIn === 'MGP' && tokenOut ==='rMGP' ? exchangeRates.mintRMGP : (tokenIn === 'rMGP' && tokenOut ==='MGP' ? (1/exchangeRates.mintRMGP)*0.9 : 1)
    return <div className="grid grid-cols-2 gap-2">
      <div>
        {tokenOut !=='MGP' && <TokenApproval sendAmount={amounts.send} allowance={allowances[tokenIn][0]} onApprove={infinity => actions.approve(tokenOut, tokenIn, infinity)} tokenSymbol={tokenIn} />}
        <button type="submit" className="py-2 rounded-lg transition-colors bg-green-600 hover:bg-green-700 h-min w-full" onClick={nativeSwap}>{label} ({formatEther(BigInt(Number(amounts.send)*nativeRate)).toFixed(4)} {tokenOut})</button>
      </div>
      <BuyOnCurve sendAmount={amounts.send} curveAmount={amounts.mgpRmgpCurve} allowanceCurve={allowances.curve[tokenIn][0]} nativeRate={nativeRate} onApprove={infinity => actions.approve('cMGP', tokenIn, infinity)} buy={buy} tokenASymbol={tokenIn} tokenBSymbol={tokenOut} />
    </div>
  }
  if (tokenIn === 'MGP' && tokenOut ==='yMGP') return <BuyOnCurve sendAmount={amounts.send} curveAmount={amounts.mgpYmgpCurve} allowanceCurve={allowances.curve[tokenIn][0]} nativeRate={1} onApprove={infinity => actions.approve('cMGP', tokenIn, infinity)} buy={actions.convertMGP} tokenASymbol={tokenIn} tokenBSymbol={tokenOut} />
  if (tokenIn === 'yMGP' && tokenOut ==='rMGP') return <BuyOnCurve sendAmount={amounts.send} curveAmount={amounts.ymgpRmgpCurve} allowanceCurve={allowances.curve[tokenIn][0]} nativeRate={1} onApprove={infinity => actions.approve('cMGP', tokenIn, infinity)} buy={actions.sellYMGP} tokenASymbol={tokenIn} tokenBSymbol={tokenOut} />
  if (tokenIn === 'yMGP' && tokenOut ==='MGP') return <BuyOnCurve sendAmount={amounts.send} curveAmount={amounts.ymgpMgpCurve} allowanceCurve={allowances.curve[tokenIn][0]} nativeRate={(1/exchangeRates.mintRMGP)*0.9} onApprove={infinity => actions.approve('cMGP', tokenIn, infinity)} buy={actions.sellYMGP} tokenASymbol={tokenIn} tokenBSymbol={tokenOut} />
  if (tokenIn === 'ETH') return <button type="submit" className="py-2 rounded-lg transition-colors bg-green-600 hover:bg-green-700 h-min w-full" onClick={() => actions.mintWETH()}>Mint WETH</button>
  return <>
    <TokenApproval sendAmount={amounts.send} allowance={allowances.odos[tokenIn][0]} onApprove={infinity => actions.approve('ODOSRouter', tokenIn, infinity)} tokenSymbol={tokenIn} />
    <button type="submit" className="py-2 rounded-lg transition-colors bg-green-600 hover:bg-green-700 h-min w-full" onClick={() => actions.swap(contracts[wallet.chain][tokenIn].address, contracts[wallet.chain].MGP.address)}>Swap to MGP With Odos</button>
  </>
}