import { memo, type ReactElement } from 'react'
import { formatEther, formatNumber, formatTime } from '../utils'
import { contracts, decimals, type Coins } from '../config/contracts'
import { useGlobalContext } from '../contexts/GlobalContext'
import { Page } from '../components/Page'

export const CompoundYield = memo((): ReactElement => {
  const { actions, locked, prices, rewards, wallet } = useGlobalContext()

  return <Page info="Pending yield (PNP, EGP, etc) gets converted to MGP and locked as vlMGP. The underlying backing of rMGP increases each time yields are compounded. 1% of MGP yield is sent to the compounder as yMGP, 4% sent to the treasury, and 5% to locked yMGP holders. By clicking the button below, you will receive 1% of the pending yield.">
    <h3 className="text-md font-medium mb-1">Uncompounded Yield</h3>
    <div className="bg-gray-700/50 p-5 rounded-lg p-2">
      <div className="flex items-center justify-between mb-2">
        <p className="font-medium text-lg">{formatNumber(rewards.uncompoundedMGPYield, 4)} MGP</p>
        <p className="font-medium text-lg">${formatNumber(rewards.uncompoundedMGPYield*prices.MGP, 4)}</p>
      </div>
      {(Object.keys(rewards.pendingRewards) as Coins[]).map(symbol => <div key={symbol} className="flex justify-between">
        <p className="font-small text-xs">{formatNumber(formatEther(rewards.pendingRewards[symbol].rewards, decimals[symbol]), 4)} {symbol}</p>
        <p className="font-small text-xs">{formatNumber(prices[symbol]*Number(formatEther(rewards.pendingRewards[symbol].rewards, decimals[symbol]))/prices.MGP, 4)} MGP</p>
      </div>)}
    </div>
    <button type="button" className="w-full mt-4 bg-green-600 hover:bg-green-700 py-3 rounded-lg transition-colors" onClick={actions.compoundRMGP}>Compound Yield (Get ~{(Number(rewards.estimatedCompoundAmount[0] ?? 0n))/100} yMGP)</button>
    <div className="mt-4 text-sm text-gray-400">
      <div className="flex justify-between mb-1">
        <span>Estimated Payout</span>
        <span>${formatNumber(rewards.uncompoundedMGPYield*prices.MGP*0.01, 4)}</span>
      </div>
      <div className="flex justify-between mb-1">
        <span>Estimated Gas Fee</span>
        <span>${formatNumber(rewards.estimatedCompoundGasFee, 4)}</span>
      </div>
      <div className="flex justify-between mb-1">
        <span>Estimated Profit</span>
        <span className={`text-${rewards.uncompoundedMGPYield*prices.MGP*0.01 > rewards.estimatedCompoundGasFee ? 'green' : 'red'}-400`}>{rewards.uncompoundedMGPYield*prices.MGP*0.01 > rewards.estimatedCompoundGasFee ? '' : '-'}${String(formatNumber(rewards.uncompoundedMGPYield*prices.MGP*0.01-rewards.estimatedCompoundGasFee, 6)).replace('-', '')}</span>
      </div>
      {rewards.uncompoundedMGPYield*prices.MGP*0.01 < rewards.estimatedCompoundGasFee && <div className="flex justify-between mb-1">
        <span>ETA Till Profitable</span>
        <span>{formatTime((rewards.estimatedCompoundGasFee/prices.MGP) / (formatEther(BigInt(rewards.mgpAPR*Number(locked.reefiMGP)), decimals.MGP) / (365 * 24 * 60 * 60)))}</span>
      </div>}
    </div>
    <div className="mt-6 bg-gray-900/80 rounded-xl p-4 border border-dashed border-green-700">
      <h3 className="text-lg font-semibold mb-2 text-green-400">Developer Tip: Automate Compounding for Free Money</h3>
      <p className="text-gray-300 text-sm mb-2">Compounding vlMGP yield is critical to Reefi&apos;s function. Anyone can trigger a compound, which compounds everyone&apos;s pending yield. By doing so, you receive 1% of all pending yield. You can automate this process and earn rewards with no investment.</p>
      <ul className="list-disc list-inside text-gray-400 text-xs mb-2">
        <li>Monitor the estimated profit and gas fee.</li>
        <li>Trigger compounding when profit exceeds gas cost by calling <span className="font-mono bg-gray-800 px-1 py-0.5 rounded">{contracts[wallet.chain].RMGP.address}.claim()</span> whenever rewards are higher than gas fees.</li>
        <li>This can be done using free cloud functions, GitHub Actions, or a serverless cron job.</li>
      </ul>
      <p className="text-gray-400 text-xs">
        Example: Use <span className="font-mono bg-gray-800 px-1 py-0.5 rounded">Viem</span>, <span className="font-mono bg-gray-800 px-1 py-0.5 rounded">ethers.js</span> or <span className="font-mono bg-gray-800 px-1 py-0.5 rounded">web3.js</span> in a scheduled script to call the contract method and claim your reward automatically.
      </p>
    </div>
  </Page>
})
CompoundYield.displayName = 'CompoundYield'
