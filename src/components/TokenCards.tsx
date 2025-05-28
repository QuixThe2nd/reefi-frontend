import type { ReactElement } from 'react'
import { TokenCard } from './TokenCard'
import { Coins } from '../config/contracts'
import { ExchangeRates } from '../hooks/useExchangeRates'

interface Props {
  readonly prices: Readonly<Record<Coins, number>>,
  readonly decimals: Readonly<Record<Coins, number>>,
  readonly mgpSupply: bigint,
  readonly totalLockedMGP: bigint,
  readonly rmgpSupply: bigint,
  readonly reefiLockedMGP: bigint,
  readonly ymgpSupply: bigint,
  readonly totalLockedYMGP: bigint,
  // readonly vmgpSupply: bigint,
  readonly exchangeRates: ExchangeRates
}

export const TokenCards = ({ prices, decimals, mgpSupply, totalLockedMGP, rmgpSupply, reefiLockedMGP, ymgpSupply, totalLockedYMGP, exchangeRates }: Props): ReactElement => {
  return <div className="grid grid-cols-4 gap-4 mb-4">
    <TokenCard symbol='MGP' price={prices.MGP} decimals={decimals.MGP} supply={mgpSupply} locked={totalLockedMGP} description='MGP is the underlying asset all derivatives rely on.' />
    <TokenCard symbol='rMGP' decimals={decimals.RMGP} supply={rmgpSupply} underlying={reefiLockedMGP} marketRate={exchangeRates.curve.mgpRMGP} underlyingSymbol='MGP' features={{
      "Liquid": "Tradable token representing locked MGP",
      "Auto Compounding": "Yield is automatically reinvested",
      "Pegged": "rMGP is pegged to MGP with a 10% depeg limit",
      "Redeemable": "rMGP can be redeemed for MGP natively",
    }} description='rMGP earns auto compounding yield from locked MGP, while remaining liquid. rMGP can be converted back to MGP.' />
    <TokenCard symbol='yMGP' decimals={decimals.YMGP} supply={ymgpSupply + totalLockedYMGP} marketRate={exchangeRates.curve.rmgpYMGP} locked={totalLockedYMGP} underlying={ymgpSupply + totalLockedYMGP} underlyingSymbol='rMGP' features={{ "Liquid": "Tradable token representing locked rMGP", "Extra Yield": "5% of protocol yield and withdrawals" }} description='yMGP is backed 1:1 by rMGP but cannot be converted back to rMGP. 5% of protocol yield and withdrawals are distributed to locked yMGP paid in rMGP.' />
    {/* <TokenCard symbol='vMGP' decimals={decimals.VMGP} supply={vmgpSupply} marketRate={exchangeRates.curve.ymgpVMGP} voteMultiplier={Number(vmgpSupply ?? 0n)/Number(rmgpSupply ?? 0n)} underlying={vmgpSupply} underlyingSymbol='yMGP' features={{ "Boosted Votes": "Control all of Reefi's vote power" }} description="vMGP is backed 1:1 by yMGP but cannot be converted back to yMGP. vMGP controls all of Reefi's voting power." /> */}
  </div>
}
