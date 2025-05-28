import { ReactElement } from 'react'
import { formatEther } from '../utils'
import { InfoCard } from '../components/InfoCard'
import { AmountInput } from '../components/AmountInput'

interface Props {
  readonly mgpBalance: bigint,
  readonly rmgpBalance: bigint
  readonly ymgpBalance: bigint
  readonly mgpCurveBalance: bigint,
  readonly rmgpCurveBalance: bigint
  readonly ymgpCurveBalance: bigint
  readonly mgpLPAmount: bigint
  readonly ymgpLPAmount: bigint
  readonly rmgpLPAmount: bigint
  readonly supplyLiquidity: () => void
  readonly setMGPLPAmount: (_mgpLPAmount: bigint) => void
  readonly setRMGPLPAmount: (_rmgpLPAmount: bigint) => void
  readonly setYMGPLPAmount: (_rmgpLPAmount: bigint) => void
}

export const SupplyLiquidityPage = ({ mgpBalance, mgpCurveBalance, rmgpCurveBalance, ymgpCurveBalance, mgpLPAmount, ymgpLPAmount, ymgpBalance, rmgpLPAmount, setYMGPLPAmount, rmgpBalance, supplyLiquidity, setMGPLPAmount, setRMGPLPAmount }: Props): ReactElement => {
  return <>
    <div className="bg-gray-700/50 p-5 rounded-lg">
      <AmountInput label="Supply MGP" balance={mgpBalance} value={mgpLPAmount} onChange={setMGPLPAmount} token={{ symbol: 'MGP', color: 'bg-blue-400', bgColor: 'bg-blue-600' }} placeholder={((): string => {
        const mgpTarget = Number(mgpCurveBalance) / Number(mgpCurveBalance + rmgpCurveBalance + ymgpCurveBalance)
        const totalRecommendedLP = rmgpLPAmount === 0n ? Number(ymgpLPAmount) / (Number(ymgpCurveBalance) / Number(rmgpCurveBalance + ymgpCurveBalance)) : (ymgpLPAmount === 0n ? Number(rmgpLPAmount) / (Number(rmgpCurveBalance) / Number(rmgpCurveBalance + ymgpCurveBalance)) : Number(rmgpLPAmount + ymgpLPAmount))
        return formatEther(BigInt(totalRecommendedLP * mgpTarget / (1 - mgpTarget))).toString()
      })()} />
      <div className="mb-4 text-sm text-gray-400 flex justify-between">
        <span>Target</span>
        <span>{(100*Number(mgpCurveBalance)/Number(mgpCurveBalance+rmgpCurveBalance+ymgpCurveBalance)).toFixed(0)}%</span>
      </div>
      <AmountInput label="Supply rMGP" balance={rmgpBalance} value={rmgpLPAmount} onChange={setRMGPLPAmount} token={{ symbol: 'rMGP', color: 'bg-green-400', bgColor: 'bg-green-600' }} placeholder={((): string => {
        const rmgpTarget = Number(rmgpCurveBalance) / Number(mgpCurveBalance + rmgpCurveBalance + ymgpCurveBalance)
        const totalRecommendedLP = mgpLPAmount === 0n ? Number(ymgpLPAmount) / (Number(ymgpCurveBalance) / Number(mgpCurveBalance + ymgpCurveBalance)) : (ymgpLPAmount === 0n ? Number(mgpLPAmount) / (Number(mgpCurveBalance) / Number(mgpCurveBalance + ymgpCurveBalance)) : Number(mgpLPAmount + ymgpLPAmount))
        return formatEther(BigInt(totalRecommendedLP * rmgpTarget / (1 - rmgpTarget))).toString()
      })()} />
      <div className="mb-4 text-sm text-gray-400 flex justify-between">
        <span>Target</span>
        <span>{(100*Number(rmgpCurveBalance)/Number(mgpCurveBalance+rmgpCurveBalance+ymgpCurveBalance)).toFixed(0)}%</span>
      </div>
      <AmountInput label="Supply yMGP" balance={ymgpBalance} value={ymgpLPAmount} onChange={setYMGPLPAmount} token={{ symbol: 'yMGP', color: 'bg-green-400', bgColor: 'bg-green-600' }} placeholder={((): string => {
        const ymgpTarget = Number(ymgpCurveBalance) / Number(mgpCurveBalance + rmgpCurveBalance + ymgpCurveBalance)
        const totalRecommendedLP = mgpLPAmount === 0n ? Number(rmgpLPAmount) / (Number(rmgpCurveBalance) / Number(mgpCurveBalance + rmgpCurveBalance)) : (rmgpLPAmount === 0n ? Number(mgpLPAmount) / (Number(mgpCurveBalance) / Number(mgpCurveBalance + rmgpCurveBalance)) : Number(mgpLPAmount + rmgpLPAmount))
        return formatEther(BigInt(totalRecommendedLP * ymgpTarget / (1 - ymgpTarget))).toString()
      })()} />
      <div className="mb-4 text-sm text-gray-400 flex justify-between">
        <span>Target</span>
        <span>{(100*Number(ymgpCurveBalance)/Number(mgpCurveBalance+rmgpCurveBalance+ymgpCurveBalance)).toFixed(0)}%</span>
      </div>
      <button type="submit" className="w-full py-3 rounded-lg transition-colors bg-green-600 hover:bg-green-700}" onClick={supplyLiquidity}>Get cMGP</button>
    </div>
    <InfoCard text='Supply liquidity to the cMGP Curve pool (MGP/rMGP/yMGP). You can supply liquidity at any ratio of MGP:rMGP:yMGP, however it is recommended you match the targets to prevent slippage. To stake or withdraw liquidity, use <a href="https://www.curve.finance/dex/arbitrum/pools/factory-stable-ng-179/withdraw/" className="text-blue-400">Curve</a>.' />
  </>
}
