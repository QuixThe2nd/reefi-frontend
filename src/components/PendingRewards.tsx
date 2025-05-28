import { ReactElement } from 'react'
import { formatNumber, formatEther, formatTime } from '../utils'
import { Coins } from '../config/contracts'

interface Props {
  uncompoundedMGPYield: number
  prices: Record<Coins, number>
  decimals: Record<Coins, number>
  estimatedCompoundGasFee: number
  totalLockedYMGP: bigint | undefined
  ymgpHoldings: bigint | undefined
  ymgpSupply: bigint | undefined
  unclaimedUserYield: bigint | undefined
  mgpRMGPRate: number
  reefiLockedMGP: bigint | undefined
  mgpAPR: number
  pendingRewards: Record<Coins, { address: `0x${string}`, rewards: bigint }> | undefined
  compoundRMGP: () => void
  claimYMGPRewards: () => void
}

export const PendingRewards = ({ uncompoundedMGPYield, prices, estimatedCompoundGasFee, ymgpHoldings, ymgpSupply, totalLockedYMGP, unclaimedUserYield, decimals, mgpRMGPRate, reefiLockedMGP, mgpAPR, pendingRewards, compoundRMGP, claimYMGPRewards }: Props): ReactElement => {
  return <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 mb-6">
    <h2 className="text-2xl font-bold mb-4">Pending Rewards</h2>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <div className="bg-gray-700/50 rounded-lg p-4">
          <p className="text-gray-400 text-sm">Uncompounded Yield</p>
          <div className="flex items-center justify-between">
            <p className="font-medium text-lg">{formatNumber(uncompoundedMGPYield, 6)} MGP</p>
            <p className="font-medium text-lg">${formatNumber(uncompoundedMGPYield*prices.MGP, 6)}</p>
          </div>
          <div className="bg-green-600 bg-opacity-75 w-full h-[0.5px] my-2" />
          {pendingRewards ? (Object.keys(pendingRewards) as Coins[]).map(symbol => <div key={symbol} className="flex justify-between">
            <p className="font-small text-xs">{formatNumber(formatEther(pendingRewards[symbol].rewards, decimals[symbol]), 6)} {symbol}</p>
            <p className="font-small text-xs">{formatNumber(prices[symbol]*Number(formatEther(pendingRewards[symbol].rewards, decimals[symbol]))/prices.MGP, 6)} MGP</p>
          </div>) : ''}
        </div>
        <p className="text-gray-400 text-xs mt-2">Pending yield (PNP, EGP, etc) gets converted to MGP and locked as vlMGP. The underlying backing of rMGP increases each time yields are compounded. 1% of MGP yield is sent to the compounder as yMGP, 4% sent to the treasury, and 5% to locked yMGP holders. By clicking the button below, you will receive 1% of the pending yield.</p>
        <p className="text-xs text-gray-400 mt-4">Estimated Payout: <span className="text-green-400">${formatNumber(uncompoundedMGPYield*prices.MGP*0.01, 6)}</span></p>
        <p className="text-xs text-gray-400">Estimated Gas Fee: <span className="text-red-400">${formatNumber(estimatedCompoundGasFee, 6)}</span></p>
        <p className="text-gray-400 mt-2">Estimated Profit: <span className={`text-${uncompoundedMGPYield*prices.MGP*0.01 > estimatedCompoundGasFee ? 'green' : 'red'}-400`}>{uncompoundedMGPYield*prices.MGP*0.01 > estimatedCompoundGasFee ? '' : '-'}${String(formatNumber(uncompoundedMGPYield*prices.MGP*0.01-estimatedCompoundGasFee, 6)).replace('-', '')}</span></p>
        {uncompoundedMGPYield*prices.MGP*0.01 < estimatedCompoundGasFee ? <p className="text-gray-400 text-xs">ETA Till Profitable: {formatTime((estimatedCompoundGasFee/prices.MGP) / (formatEther(BigInt(mgpAPR*Number(reefiLockedMGP)), decimals.MGP) / (365 * 24 * 60 * 60)))}</p> : ''}
        <button type="button" className="w-full mt-4 bg-green-600 hover:bg-green-700 py-3 rounded-lg transition-colors" onClick={compoundRMGP}>Compound Yield (Get ~{formatNumber(0.01*uncompoundedMGPYield*(1/mgpRMGPRate), 6)} yMGP)</button>
      </div>
      <div>
        <div className="bg-gray-700/50 rounded-lg p-4">
          <p className="text-gray-400 text-sm">Unclaimed Rewards</p>
          <p className="font-medium text-lg">{unclaimedUserYield !== undefined ? formatNumber(formatEther(unclaimedUserYield, decimals.YMGP), 4) : 'Loading...'} rMGP</p>
          <p className="font-small text-xs">Total: {ymgpHoldings === undefined || ymgpSupply === undefined || totalLockedYMGP === undefined ? 'Loading...' : formatNumber(formatEther(ymgpHoldings-ymgpSupply-totalLockedYMGP, decimals.YMGP), 4)} rMGP</p>
        </div>
        <p className="text-gray-400 text-xs mt-2">Locked yMGP earns additional yield from the underlying vlMGP and from 5% of rMGP withdrawal.</p>
        <button type="button" className="w-full mt-4 bg-green-600 hover:bg-green-700 py-3 rounded-lg transition-colors" onClick={claimYMGPRewards}>Claim Rewards</button>
      </div>
    </div>
  </div>
}