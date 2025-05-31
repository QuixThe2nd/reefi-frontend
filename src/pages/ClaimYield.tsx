import { memo, type ReactElement } from 'react'
import { formatEther, formatNumber } from '../utils'
import { decimals } from '../config/contracts'
import { useGlobalContext } from '../contexts/GlobalContext'
import { Page } from '../components/Page'

export const ClaimYield = memo((): ReactElement => {
  const { actions, balances, locked, supplies, rewards } = useGlobalContext()

  return <Page info={["Locked yMGP earns additional yield from the underlying vlMGP and from 5% of rMGP withdrawal.", "To claim pending MGP yield, compound rMGP yield."]}>
    <h3 className="text-md font-medium mb-1">Unclaimed Rewards</h3>
    <div className="bg-gray-700/50 rounded-lg p-4 flex justify-between">
      <div className="flex flex-col">
        <p className="font-medium text-lg">You: {formatNumber(formatEther(rewards.unclaimedUserYield, decimals.yMGP), 4)} rMGP</p>
        <p className="text-sm text-gray-400">+{formatNumber(0.05*rewards.uncompoundedMGPYield*(Number(locked.userYMGP)/Number(locked.ymgp)), 4)} MGP</p>
      </div>
      <div className="flex flex-col text-right">
        <p className="font-medium text-lg">Total: {formatNumber(formatEther(balances.ymgpHoldings-supplies.ymgp-locked.ymgp, decimals.yMGP), 4)} rMGP</p>
        <p className="text-sm text-gray-400">+{formatNumber(rewards.uncompoundedMGPYield*0.05, 4)} MGP</p>
      </div>
    </div>
    <button type="button" className="w-full mt-4 bg-green-600 hover:bg-green-700 py-3 rounded-lg transition-colors" onClick={actions.claimYMGPRewards}>Claim Rewards</button>
  </Page>
})
ClaimYield.displayName = 'ClaimYield'
