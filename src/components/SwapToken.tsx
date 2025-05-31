import { ReactElement, useState } from "react"
import { Coins } from "../config/contracts"
import { useGlobalContext } from "../contexts/GlobalContext"
import { SwapInput } from "./SwapInput"
import { SwapButton } from "./SwapButton"

export const SwapToken = ({ originalTokenIn, tokenOut, nativeRate, buy, nativeSwap, label, excludeCoins }: { originalTokenIn: Coins, tokenOut: Coins, nativeRate: number, curveAmount: bigint, buy: () => void, nativeSwap?: () => void, label?: string, excludeCoins: Coins[] }): ReactElement => {
  const { amounts, balances } = useGlobalContext()
  const [tokenIn, setTokenIn] = useState<Coins | 'ETH'>(originalTokenIn)
  return <>
    <SwapInput label={`Get ${tokenOut}`} selectedCoin={tokenIn} onCoinChange={setTokenIn} balance={balances[tokenIn][0]} value={amounts.send} onChange={amounts.setSend} outputCoin={tokenOut} excludeCoins={excludeCoins} />
    <SwapButton nativeRate={nativeRate} buy={buy} nativeSwap={nativeSwap} label={label} tokenIn={tokenIn} tokenOut={tokenOut} />
  </>
}
