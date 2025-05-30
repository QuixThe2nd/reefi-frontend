import { memo, type ReactElement } from 'react'
import { formatEther, formatNumber } from '../utils'
import { decimals } from '../config/contracts'
import { useGlobalContext } from '../contexts/GlobalContext'
import { Page } from '../components/Page'

export const ClaimYield = memo((): ReactElement => {
  const { actions, balances, locked, supplies, rewards } = useGlobalContext()

  return <Page info="Locked yMGP earns additional yield from the underlying vlMGP and from 5% of rMGP withdrawal.">
    <h3 className="text-md font-medium mb-1">Unclaimed Rewards</h3>
    <div className="bg-gray-700/50 rounded-lg p-4">
      <p className="font-medium text-lg mb-2">{formatNumber(formatEther(rewards.unclaimedUserYield, decimals.YMGP), 4)} rMGP</p>
      <p className="font-small text-xs">Total: {formatNumber(formatEther(balances.ymgpHoldings-supplies.ymgp-locked.ymgp, decimals.YMGP), 4)} rMGP</p>
    </div>
    <button type="button" className="w-full mt-4 bg-green-600 hover:bg-green-700 py-3 rounded-lg transition-colors" onClick={actions.claimYMGPRewards}>Claim Rewards</button>
  </Page>
})
ClaimYield.displayName = 'ClaimYield'
