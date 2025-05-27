import { ReactElement } from 'react'
import { formatEther, parseEther } from '../utils'
import { Coins } from '../App'

interface Props {
  mgpBalance: bigint | undefined,
  rmgpBalance: bigint | undefined
  ymgpBalance: bigint | undefined
  mgpCurveBalance: bigint | undefined,
  rmgpCurveBalance: bigint | undefined
  ymgpCurveBalance: bigint | undefined
  mgpLPAmount: bigint
  ymgpLPAmount: bigint
  rmgpLPAmount: bigint
  decimals: Record<Coins, number>
  supplyLiquidity: () => void
  setMGPLPAmount: (mgpLPAmount: bigint) => void
  setRMGPLPAmount: (rmgpLPAmount: bigint) => void
  setYMGPLPAmount: (rmgpLPAmount: bigint) => void
}

export const SupplyLiquidityPage = ({ mgpBalance, mgpCurveBalance, rmgpCurveBalance, decimals, ymgpCurveBalance, mgpLPAmount, ymgpLPAmount, ymgpBalance, rmgpLPAmount, setYMGPLPAmount, rmgpBalance, supplyLiquidity, setMGPLPAmount, setRMGPLPAmount }: Props): ReactElement => {
  return <>
    <div className="bg-gray-700/50 p-5 rounded-lg">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-md font-medium">Supply MGP</h3>
          <div className="text-sm text-gray-400">Balance: {mgpBalance !== undefined ? formatEther(mgpBalance, decimals.MGP) : 'Loading...'} MGP</div>
        </div>
        <div className="bg-gray-900 rounded-lg p-4 flex items-center justify-between">
          <input type="text" placeholder={((): string => {
              if (mgpCurveBalance === undefined || rmgpCurveBalance === undefined || ymgpCurveBalance === undefined) return '0'
              const mgpTarget = Number(mgpCurveBalance) / Number(mgpCurveBalance + rmgpCurveBalance + ymgpCurveBalance)
              const totalRecommendedLP = rmgpLPAmount === 0n ? Number(ymgpLPAmount) / (Number(ymgpCurveBalance) / Number(rmgpCurveBalance + ymgpCurveBalance)) : ymgpLPAmount === 0n ? Number(rmgpLPAmount) / (Number(rmgpCurveBalance) / Number(rmgpCurveBalance + ymgpCurveBalance)) : Number(rmgpLPAmount + ymgpLPAmount)
              const recommendedAmount = BigInt(totalRecommendedLP * mgpTarget / (1 - mgpTarget))
              return formatEther(recommendedAmount).toString()
            })()} className="bg-transparent outline-none text-xl w-3/4" value={mgpLPAmount === 0n ? undefined : formatEther(mgpLPAmount)} onChange={e => setMGPLPAmount(parseEther(Number.isNaN(Number.parseFloat(e.target.value)) ? 0 : Number.parseFloat(e.target.value)))} />
          <div className="flex items-center space-x-2">
            <button type="button" className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded" onClick={() => setMGPLPAmount(mgpBalance ?? 0n)}>MAX</button>
            <div className="bg-blue-600 rounded-md px-3 py-1 flex items-center">
              <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center mr-2">M</div>
              <span>MGP</span>
            </div>
          </div>
        </div>
        <div className="mt-2 text-sm text-gray-400 flex justify-between">
          <span>Target</span>
          <span>{mgpCurveBalance === undefined || rmgpCurveBalance === undefined || ymgpCurveBalance === undefined ? 'Loading...' : `${(100*Number(mgpCurveBalance)/Number(mgpCurveBalance+rmgpCurveBalance+ymgpCurveBalance)).toFixed()}%`}</span>
        </div>
      </div>
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-md font-medium">Supply rMGP</h3>
          <div className="text-sm text-gray-400">Balance: {rmgpBalance !== undefined ? formatEther(rmgpBalance, decimals.RMGP) : 'Loading...'} rMGP</div>
        </div>
        <div className="bg-gray-900 rounded-lg p-4 flex items-center justify-between">
          <input type="text" placeholder={((): string => {
              if (mgpCurveBalance === undefined || rmgpCurveBalance === undefined || ymgpCurveBalance === undefined) return '0'
              const rmgpTarget = Number(rmgpCurveBalance) / Number(mgpCurveBalance + rmgpCurveBalance + ymgpCurveBalance)
              const totalRecommendedLP = mgpLPAmount === 0n ? Number(ymgpLPAmount) / (Number(ymgpCurveBalance) / Number(mgpCurveBalance + ymgpCurveBalance)) : ymgpLPAmount === 0n ? Number(mgpLPAmount) / (Number(mgpCurveBalance) / Number(mgpCurveBalance + ymgpCurveBalance)) : Number(mgpLPAmount + ymgpLPAmount)
              const recommendedAmount = BigInt(totalRecommendedLP * rmgpTarget / (1 - rmgpTarget))
              return formatEther(recommendedAmount).toString()
            })()} className="bg-transparent outline-none text-xl w-3/4" value={rmgpLPAmount === 0n ? undefined : formatEther(rmgpLPAmount)} onChange={e => setRMGPLPAmount(parseEther(Number.isNaN(Number.parseFloat(e.target.value)) ? 0 : Number.parseFloat(e.target.value)))} />
          <div className="flex items-center space-x-2">
            <button type="button" className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded" onClick={() => setRMGPLPAmount(rmgpBalance ?? 0n)}>MAX</button>
            <div className="bg-green-600 rounded-md px-3 py-1 flex items-center">
              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center mr-2">R</div>
              <span>rMGP</span>
            </div>
          </div>
        </div>
        <div className="mt-2 text-sm text-gray-400 flex justify-between">
          <span>Target</span>
          <span>{mgpCurveBalance === undefined || rmgpCurveBalance === undefined || ymgpCurveBalance === undefined ? 'Loading...' : `${(100*Number(rmgpCurveBalance)/Number(mgpCurveBalance+rmgpCurveBalance+ymgpCurveBalance)).toFixed()}%`}</span>
        </div>
      </div>
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-md font-medium">Supply yMGP</h3>
          <div className="text-sm text-gray-400">Balance: {ymgpBalance !== undefined ? formatEther(ymgpBalance, decimals.YMGP) : 'Loading...'} yMGP</div>
        </div>
        <div className="bg-gray-900 rounded-lg p-4 flex items-center justify-between">
          <input type="text" placeholder={((): string => {
              if (mgpCurveBalance === undefined || rmgpCurveBalance === undefined || ymgpCurveBalance === undefined) return '0'
              const ymgpTarget = Number(ymgpCurveBalance) / Number(mgpCurveBalance + rmgpCurveBalance + ymgpCurveBalance)
              const totalRecommendedLP = mgpLPAmount === 0n ? Number(rmgpLPAmount) / (Number(rmgpCurveBalance) / Number(mgpCurveBalance + rmgpCurveBalance)) : rmgpLPAmount === 0n ? Number(mgpLPAmount) / (Number(mgpCurveBalance) / Number(mgpCurveBalance + rmgpCurveBalance)) : Number(mgpLPAmount + rmgpLPAmount)
              const recommendedAmount = BigInt(totalRecommendedLP * ymgpTarget / (1 - ymgpTarget))
              return formatEther(recommendedAmount).toString()
            })()} className="bg-transparent outline-none text-xl w-3/4" value={ymgpLPAmount === 0n ? undefined : formatEther(ymgpLPAmount)} onChange={e => setYMGPLPAmount(parseEther(Number.isNaN(Number.parseFloat(e.target.value)) ? 0 : Number.parseFloat(e.target.value)))} />
          <div className="flex items-center space-x-2">
            <button type="button" className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded" onClick={() => setYMGPLPAmount(ymgpBalance ?? 0n)}>MAX</button>
            <div className="bg-green-600 rounded-md px-3 py-1 flex items-center">
              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center mr-2">Y</div>
              <span>yMGP</span>
            </div>
          </div>
        </div>
        <div className="mt-2 text-sm text-gray-400 flex justify-between">
          <span>Target</span>
          <span>{mgpCurveBalance === undefined || rmgpCurveBalance === undefined || ymgpCurveBalance === undefined ? 'Loading...' : `${(100*Number(ymgpCurveBalance)/Number(mgpCurveBalance+rmgpCurveBalance+ymgpCurveBalance)).toFixed()}%`}</span>
        </div>
      </div>
      <button type="submit" className="w-full py-3 rounded-lg transition-colors bg-green-600 hover:bg-green-700}" onClick={supplyLiquidity}>Get cMGP</button>
    </div>
    <div className="mt-4 bg-indigo-900/20 border border-green-800/30 rounded-lg p-3 text-sm">
      <div className="flex items-start">
        <div className="p-1 bg-indigo-800/30 rounded-full mr-3 mt-0.5">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400"><title>Info</title><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
        </div>
        <div>
          <span className="font-medium text-indigo-300">About</span>
          <p className="text-gray-300 mt-1">Supply liquidity to the cMGP Curve pool (MGP/rMGP/yMGP). You can supply liquidity at any ratio of MGP:rMGP:yMGP, however it is recommended you match the targets to prevent slippage. To stake or withdraw liquidity, use <a href="https://www.curve.finance/dex/arbitrum/pools/factory-stable-ng-179/withdraw/" className="text-blue-400">Curve</a>.</p>
        </div>
      </div>
    </div>
  </>
}
