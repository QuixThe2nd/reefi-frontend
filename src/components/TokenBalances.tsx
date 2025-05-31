import { memo, type ReactElement } from 'react'
import { TokenBalance } from './TokenBalance'
import { useGlobalContext } from '../contexts/GlobalContext'
import { decimals } from '../config/contracts'

export const TokenBalances = memo((): ReactElement => {
  const { balances } = useGlobalContext()
  return <>
    <TokenBalance symbol="MGP" balance={balances.MGP[0]} decimals={decimals.MGP} />
    <TokenBalance symbol="rMGP" balance={balances.rMGP[0]} decimals={decimals.rMGP} />
    <TokenBalance symbol="yMGP" balance={balances.yMGP[0]} decimals={decimals.yMGP} />
    {/* <TokenBalance symbol="VMGP" balance={vmgpBalance} decimals={decimals.VMGP} /> */}
    <TokenBalance symbol="cMGP" balance={balances.cMGP[0]} decimals={decimals.cMGP} /> 
    {/* <TokenBalance symbol="Locked yMGP" balance={userLockedYMGP} decimals={decimals.YMGP} /> */}
  </>
})
TokenBalances.displayName = 'TokenBalance';
