import { memo, type ReactElement } from 'react'
import { formatEther, formatNumber } from '../utils'
import { decimals } from '../config/contracts'
import { useGlobalContext } from '../contexts/GlobalContext'

export const ClaimYield = memo((): ReactElement => {
  const { actions, balances, locked, supplies, rewards } = useGlobalContext()

  return <div className="rounded-lg mt-4 ">
    <div className="bg-gray-700/50 rounded-lg p-4">
      <p className="text-gray-400 text-sm">Unclaimed Rewards</p>
      <p className="font-medium text-lg">{formatNumber(formatEther(rewards.unclaimedUserYield, decimals.YMGP), 4)} rMGP</p>
      <p className="font-small text-xs">Total: {formatNumber(formatEther(balances.ymgpHoldings-supplies.ymgp-locked.ymgp, decimals.YMGP), 4)} rMGP</p>
    </div>
    <p className="text-gray-400 text-xs mt-2">Locked yMGP earns additional yield from the underlying vlMGP and from 5% of rMGP withdrawal.</p>
    <button type="button" className="w-full mt-4 bg-green-600 hover:bg-green-700 py-3 rounded-lg transition-colors" onClick={actions.claimYMGPRewards}>Claim Rewards</button>
  </div>
})
ClaimYield.displayName = 'ClaimYield'
