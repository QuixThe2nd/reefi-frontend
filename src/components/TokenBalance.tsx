import { ReactElement, memo } from "react"
import { formatEther } from "../utils"
import { Coins } from "../config/contracts"

export const TokenBalance = memo(({ symbol, balance, decimals }: { symbol: Coins, balance: bigint, decimals: number }): ReactElement => {
  return <div className="bg-gray-700 rounded-lg px-3 py-2 text-sm">{symbol}: {formatEther(balance, decimals).toFixed(4)}</div>
})
TokenBalance.displayName = 'TokenBalance';
