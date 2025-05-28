import { memo, type ReactElement } from 'react'
import { Coins } from '../config/contracts'
import { TokenBalance } from './TokenBalance'

interface Props {
  readonly decimals: Readonly<Record<Coins, number>>
  readonly mgpBalance: bigint
  readonly rmgpBalance: bigint
  readonly ymgpBalance: bigint
  // readonly vmgpBalance: bigint
  readonly cmgpBalance: bigint
  readonly userLockedYMGP: bigint
}

export const TokenBalances = memo(({ decimals, mgpBalance, rmgpBalance, ymgpBalance, cmgpBalance }: Props): ReactElement => {
  return <>
    <TokenBalance symbol="MGP" balance={mgpBalance} decimals={decimals.MGP} />
    <TokenBalance symbol="RMGP" balance={rmgpBalance} decimals={decimals.RMGP} />
    <TokenBalance symbol="YMGP" balance={ymgpBalance} decimals={decimals.YMGP} />
    {/* <TokenBalance symbol="VMGP" balance={vmgpBalance} decimals={decimals.VMGP} /> */}
    <TokenBalance symbol="CMGP" balance={cmgpBalance} decimals={decimals.CMGP} /> 
    {/* <TokenBalance symbol="Locked yMGP" balance={userLockedYMGP} decimals={decimals.YMGP} /> */}
  </>
})
TokenBalances.displayName = 'TokenBalance';
