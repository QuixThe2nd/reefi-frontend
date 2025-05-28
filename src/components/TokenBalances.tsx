import type { ReactElement } from 'react'
import { formatEther } from '../utils'
import { Coins } from '../config/contracts'

interface Props {
  readonly decimals: Readonly<Record<Coins, number>>
  readonly mgpBalance: bigint
  readonly rmgpBalance: bigint
  readonly ymgpBalance: bigint
  // readonly vmgpBalance: bigint
  readonly cmgpBalance: bigint
  readonly userLockedYMGP: bigint
}

export const TokenBalances = ({ decimals, mgpBalance, rmgpBalance, ymgpBalance, cmgpBalance, userLockedYMGP }: Props): ReactElement => {
  return <>
    <div className="bg-gray-700 rounded-lg px-3 py-2 text-sm">MGP: {formatEther(mgpBalance, decimals.MGP).toFixed(4)}</div>
    <div className="bg-gray-700 rounded-lg px-3 py-2 text-sm">rMGP: {formatEther(rmgpBalance, decimals.RMGP).toFixed(4)}</div>
    <div className="bg-gray-700 rounded-lg px-3 py-2 text-sm">yMGP: {formatEther(ymgpBalance, decimals.YMGP).toFixed(4)}</div>
    {/* <div className="bg-gray-700 rounded-lg px-3 py-2 text-sm">vMGP: {formatEther(vmgpBalance, decimals.VMGP).toFixed(4)}</div> */}
    <div className="bg-gray-700 rounded-lg px-3 py-2 text-sm">cMGP: {formatEther(cmgpBalance, decimals.CMGP).toFixed(4)}</div>
    <div className="bg-gray-700 rounded-lg px-3 py-2 text-sm">Locked yMGP: {formatEther(userLockedYMGP, decimals.YMGP).toFixed(4)}</div>
    {/* <div className="bg-gray-700 rounded-lg px-3 py-2 text-sm">Staked cMGP: {formatEther(stakedCMGPBalance, decimals.CMGP).toFixed(4)}</div> */}
  </>
}
