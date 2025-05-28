import type { ReactElement } from 'react'
import { formatEther } from '../utils'
import { Coins } from '../config/contracts'

interface Props {
  decimals: Record<Coins, number>
  mgpBalance: bigint | undefined
  rmgpBalance: bigint | undefined
  ymgpBalance: bigint | undefined
  vmgpBalance: bigint | undefined
  cmgpBalance: bigint | undefined
  userLockedYMGP: bigint | undefined
}

export const TokenBalances = ({ decimals, mgpBalance, rmgpBalance, ymgpBalance, vmgpBalance, cmgpBalance, userLockedYMGP }: Props): ReactElement => {
  return <>
    <div className="bg-gray-700 rounded-lg px-3 py-2 text-sm">MGP: {mgpBalance !== undefined ? formatEther(mgpBalance, decimals.MGP).toFixed(4) : 'Loading...'}</div>
    <div className="bg-gray-700 rounded-lg px-3 py-2 text-sm">rMGP: {rmgpBalance !== undefined ? formatEther(rmgpBalance, decimals.RMGP).toFixed(4) : 'Loading...'}</div>
    <div className="bg-gray-700 rounded-lg px-3 py-2 text-sm">yMGP: {ymgpBalance !== undefined ? formatEther(ymgpBalance, decimals.YMGP).toFixed(4) : 'Loading...'}</div>
    <div className="bg-gray-700 rounded-lg px-3 py-2 text-sm">vMGP: {vmgpBalance !== undefined ? formatEther(vmgpBalance, decimals.VMGP).toFixed(4) : 'Loading...'}</div>
    <div className="bg-gray-700 rounded-lg px-3 py-2 text-sm">cMGP: {cmgpBalance !== undefined ? formatEther(cmgpBalance, decimals.CMGP).toFixed(4) : 'Loading...'}</div>
    <div className="bg-gray-700 rounded-lg px-3 py-2 text-sm">Locked yMGP: {userLockedYMGP !== undefined ? formatEther(userLockedYMGP, decimals.YMGP).toFixed(4) : 'Loading...'}</div>
    {/* <div className="bg-gray-700 rounded-lg px-3 py-2 text-sm">Staked cMGP: {stakedCMGPBalance !== undefined ? formatEther(stakedCMGPBalance, decimals.CMGP).toFixed(4) : 'Loading...'}</div> */}
  </>
}
