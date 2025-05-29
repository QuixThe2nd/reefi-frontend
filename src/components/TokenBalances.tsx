import { memo, type ReactElement } from 'react'
import { TokenBalance } from './TokenBalance'
import { useGlobalContext } from '../contexts/GlobalContext'
import { decimals } from '../config/contracts'

export const TokenBalances = memo((): ReactElement => {
  const { balances } = useGlobalContext()
  return <>
    <TokenBalance symbol="MGP" balance={balances.mgp} decimals={decimals.MGP} />
    <TokenBalance symbol="RMGP" balance={balances.rmgp} decimals={decimals.RMGP} />
    <TokenBalance symbol="YMGP" balance={balances.ymgp} decimals={decimals.YMGP} />
    {/* <TokenBalance symbol="VMGP" balance={vmgpBalance} decimals={decimals.VMGP} /> */}
    <TokenBalance symbol="CMGP" balance={balances.cmgp} decimals={decimals.CMGP} /> 
    {/* <TokenBalance symbol="Locked yMGP" balance={userLockedYMGP} decimals={decimals.YMGP} /> */}
  </>
})
TokenBalances.displayName = 'TokenBalance';
