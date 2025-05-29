import { memo, type ReactElement } from 'react'
import { formatNumber, formatEther, formatTime } from '../utils'
import { Chains, Coins, contracts } from '../config/contracts'

interface Props {
  readonly uncompoundedMGPYield: number
  readonly prices: Readonly<Record<Coins, number>>
  readonly decimals: Readonly<Record<Coins, number>>
  readonly estimatedCompoundGasFee: number
  readonly totalLockedYMGP: bigint
  readonly ymgpHoldings: bigint
  readonly ymgpSupply: bigint
  readonly unclaimedUserYield: bigint
  readonly mgpRMGPRate: number
  readonly reefiLockedMGP: bigint
  readonly mgpAPR: number
  readonly pendingRewards: Readonly<Record<Coins, { readonly address: `0x${string}`, readonly rewards: bigint }>> | undefined
  readonly chain: Chains
  readonly compoundRMGP: () => void
  readonly claimYMGPRewards: () => void
}

export const PendingRewards = memo(({ uncompoundedMGPYield, prices, estimatedCompoundGasFee, ymgpHoldings, ymgpSupply, totalLockedYMGP, unclaimedUserYield, decimals, mgpRMGPRate, reefiLockedMGP, mgpAPR, pendingRewards, compoundRMGP, claimYMGPRewards, chain }: Props): ReactElement => {
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
          <p className="font-medium text-lg">{formatNumber(formatEther(unclaimedUserYield, decimals.YMGP), 4)} rMGP</p>
          <p className="font-small text-xs">Total: {formatNumber(formatEther(ymgpHoldings-ymgpSupply-totalLockedYMGP, decimals.YMGP), 4)} rMGP</p>
        </div>
        <p className="text-gray-400 text-xs mt-2">Locked yMGP earns additional yield from the underlying vlMGP and from 5% of rMGP withdrawal.</p>
        <button type="button" className="w-full mt-4 bg-green-600 hover:bg-green-700 py-3 rounded-lg transition-colors" onClick={claimYMGPRewards}>Claim Rewards</button>
      </div>
    </div>
    <div className="mt-6 bg-gray-900/80 rounded-xl p-4 border border-dashed border-green-700">
      <h3 className="text-lg font-semibold mb-2 text-green-400">Developer Tip: Automate Compounding for Free Money</h3>
      <p className="text-gray-300 text-sm mb-2">Compounding vlMGP yield is critical to Reefi&apos;s function. Anyone can trigger a compound, which compounds everyone&apos;s pending yield. By doing so, you receive 1% of all pending yield. You can automate this process and earn rewards with no investment.</p>
      <ul className="list-disc list-inside text-gray-400 text-xs mb-2">
        <li>Monitor the estimated profit and gas fee.</li>
        <li>Trigger compounding when profit exceeds gas cost by calling <span className="font-mono bg-gray-800 px-1 py-0.5 rounded">{contracts[chain].RMGP.address}.claim()</span> whenever rewards are higher than gas fees.</li>
        <li>This can be done using free cloud functions, GitHub Actions, or a serverless cron job.</li>
      </ul>
      <p className="text-gray-400 text-xs">
        Example: Use <span className="font-mono bg-gray-800 px-1 py-0.5 rounded">Viem</span>, <span className="font-mono bg-gray-800 px-1 py-0.5 rounded">ethers.js</span> or <span className="font-mono bg-gray-800 px-1 py-0.5 rounded">web3.js</span> in a scheduled script to call the contract method and claim your reward automatically.
      </p>
    </div>
  </div>
})
PendingRewards.displayName = 'PendingRewards'
