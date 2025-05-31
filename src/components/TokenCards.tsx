import { memo, type ReactElement } from 'react'
import { TokenCard } from './TokenCard'
import { decimals } from '../config/contracts'
import { useGlobalContext } from '../contexts/GlobalContext'

export const TokenCards = memo((): ReactElement => {
  const { prices, supplies, locked, exchangeRates } = useGlobalContext()
  return <div className="grid grid-cols-4 gap-4">
    <TokenCard symbol='MGP' color="blue" price={prices.MGP} decimals={decimals.MGP} supply={supplies.mgp} locked={locked.mgp} description='MGP is the underlying asset all derivatives rely on.' />
    <TokenCard symbol='rMGP' decimals={decimals.rMGP} supply={supplies.rmgp} underlying={locked.reefiMGP} marketRate={exchangeRates.curve.mgpRMGP} underlyingSymbol='MGP' description='rMGP earns auto compounding yield from locked MGP, while remaining liquid. rMGP can be converted back to MGP.' color='green' />
    <TokenCard symbol='yMGP' decimals={decimals.yMGP} supply={supplies.ymgp + locked.ymgp} marketRate={exchangeRates.curve.rmgpYMGP} locked={locked.ymgp} underlying={supplies.ymgp + locked.ymgp} underlyingSymbol='rMGP' description='yMGP is backed 1:1 by rMGP but cannot be converted back to rMGP. 5% of protocol yield and withdrawals are distributed to locked yMGP paid in rMGP.' color='green' />
    {/* <TokenCard symbol='vMGP' decimals={decimals.VMGP} supply={vmgpSupply} marketRate={exchangeRates.curve.ymgpVMGP} voteMultiplier={Number(vmgpSupply ?? 0n)/Number(rmgpSupply ?? 0n)} underlying={vmgpSupply} underlyingSymbol='yMGP' features={{ "Boosted Votes": "Control all of Reefi's vote power" }} description="vMGP is backed 1:1 by yMGP but cannot be converted back to yMGP. vMGP controls all of Reefi's voting power." /> */}
  </div>
})
TokenCards.displayName = 'TokenCards'
