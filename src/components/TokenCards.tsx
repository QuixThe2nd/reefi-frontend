import type { ReactElement } from 'react'
import { TokenCard } from './TokenCard'
import { Chains, Coins } from '../config/contracts'
import { useExchangeRates } from '../hooks/useExchangeRates'

interface Props {
  prices: Record<Coins, number>,
  decimals: Record<Coins, number>,
  mgpSupply: bigint | undefined,
  totalLockedMGP: bigint | undefined,
  rmgpSupply: bigint | undefined,
  reefiLockedMGP: bigint | undefined,
  ymgpSupply: bigint | undefined,
  totalLockedYMGP: bigint | undefined,
  vmgpSupply: bigint | undefined,
  account: `0x${string}`
  chain: Chains
}

export const TokenCards = ({ prices, decimals, mgpSupply, totalLockedMGP, rmgpSupply, reefiLockedMGP, ymgpSupply, totalLockedYMGP, account, chain }: Props): ReactElement => {
  const exchangeRates = useExchangeRates({ reefiLockedMGP, account, chain })
  return <div className="grid grid-cols-4 gap-4 mb-4">
    <TokenCard symbol='MGP' price={prices.MGP} decimals={decimals.MGP} supply={mgpSupply} locked={totalLockedMGP} description='MGP is the underlying asset all derivatives rely on.' />
    <TokenCard symbol='rMGP' decimals={decimals.RMGP} supply={rmgpSupply} underlying={reefiLockedMGP} marketRate={exchangeRates.curve.mgpRMGP} underlyingSymbol='MGP' features={{
      "Liquid": "Tradable token representing locked MGP",
      "Auto Compounding": "Yield is automatically reinvested",
      "Pegged": "rMGP is pegged to MGP with a 10% depeg limit",
      "Redeemable": "rMGP can be redeemed for MGP natively",
    }} description='rMGP earns auto compounding yield from locked MGP, while remaining liquid. rMGP can be converted back to MGP.' />
    <TokenCard symbol='yMGP' decimals={decimals.YMGP} supply={(ymgpSupply ?? 0n) + (totalLockedYMGP ?? 0n)} marketRate={exchangeRates.curve.rmgpYMGP} locked={totalLockedYMGP} underlying={(ymgpSupply ?? 0n) + (totalLockedYMGP ?? 0n)} underlyingSymbol='rMGP' features={{ "Liquid": "Tradable token representing locked rMGP", "Extra Yield": "5% of protocol yield and withdrawals" }} description='yMGP is backed 1:1 by rMGP but cannot be converted back to rMGP. 5% of protocol yield and withdrawals are distributed to locked yMGP paid in rMGP.' />
    {/* <TokenCard symbol='vMGP' decimals={decimals.VMGP} supply={vmgpSupply} marketRate={exchangeRates.curve.ymgpVMGP} voteMultiplier={Number(vmgpSupply ?? 0n)/Number(rmgpSupply ?? 0n)} underlying={vmgpSupply} underlyingSymbol='yMGP' features={{ "Boosted Votes": "Control all of Reefi's vote power" }} description="vMGP is backed 1:1 by yMGP but cannot be converted back to yMGP. vMGP controls all of Reefi's voting power." /> */}
  </div>
}
