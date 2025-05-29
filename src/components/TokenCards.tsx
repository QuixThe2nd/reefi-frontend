import { memo, type ReactElement } from 'react'
import { TokenCard } from './TokenCard'
import { Coins } from '../config/contracts'

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
  readonly mgpRMGPRate: number,
  readonly rmgpYMGPRate: number,
}

export const TokenCards = memo(({ prices, decimals, mgpSupply, totalLockedMGP, rmgpSupply, reefiLockedMGP, ymgpSupply, totalLockedYMGP, mgpRMGPRate, rmgpYMGPRate }: Props): ReactElement => {
  return <div className="grid grid-cols-4 gap-4 mb-4">
    <TokenCard symbol='MGP' price={prices.MGP} decimals={decimals.MGP} supply={mgpSupply} locked={totalLockedMGP} description='MGP is the underlying asset all derivatives rely on.' />
    <TokenCard symbol='rMGP' decimals={decimals.RMGP} supply={rmgpSupply} underlying={reefiLockedMGP} marketRate={mgpRMGPRate} underlyingSymbol='MGP' description='rMGP earns auto compounding yield from locked MGP, while remaining liquid. rMGP can be converted back to MGP.' />
    <TokenCard symbol='yMGP' decimals={decimals.YMGP} supply={ymgpSupply + totalLockedYMGP} marketRate={rmgpYMGPRate} locked={totalLockedYMGP} underlying={ymgpSupply + totalLockedYMGP} underlyingSymbol='rMGP' description='yMGP is backed 1:1 by rMGP but cannot be converted back to rMGP. 5% of protocol yield and withdrawals are distributed to locked yMGP paid in rMGP.' />
    {/* <TokenCard symbol='vMGP' decimals={decimals.VMGP} supply={vmgpSupply} marketRate={exchangeRates.curve.ymgpVMGP} voteMultiplier={Number(vmgpSupply ?? 0n)/Number(rmgpSupply ?? 0n)} underlying={vmgpSupply} underlyingSymbol='yMGP' features={{ "Boosted Votes": "Control all of Reefi's vote power" }} description="vMGP is backed 1:1 by yMGP but cannot be converted back to yMGP. vMGP controls all of Reefi's voting power." /> */}
  </div>
})
TokenCards.displayName = 'TokenCards'
