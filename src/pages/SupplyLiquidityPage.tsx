import { memo, type ReactElement } from 'react'
import { formatEther } from '../utils'
import { InfoCard } from '../components/InfoCard'
import { AmountInput } from '../components/AmountInput'
import { useGlobalContext } from '../contexts/GlobalContext'

export const SupplyLiquidityPage = memo((): ReactElement => {
  const { actions, amounts, balances } = useGlobalContext()
  return <>
    <div className="bg-gray-700/50 p-5 rounded-lg">
      <AmountInput label="Supply MGP" balance={balances.MGP[0]} value={amounts.mgpLP} onChange={amounts.setMGPLP} token={{ symbol: 'MGP', color: 'bg-blue-400', bgColor: 'bg-blue-600' }} placeholder={((): string => {
        const mgpTarget = Number(balances.mgpCurve) / Number(balances.mgpCurve + balances.rmgpCurve + balances.ymgpCurve)
        const totalRecommendedLP = amounts.rmgpLP === 0n ? Number(amounts.ymgpLP) / (Number(balances.ymgpCurve) / Number(balances.rmgpCurve + balances.ymgpCurve)) : (amounts.ymgpLP === 0n ? Number(amounts.rmgpLP) / (Number(balances.rmgpCurve) / Number(balances.rmgpCurve + balances.ymgpCurve)) : Number(amounts.rmgpLP + amounts.ymgpLP))
        return formatEther(BigInt(totalRecommendedLP * mgpTarget / (1 - mgpTarget))).toString()
      })()} />
      <div className="mb-4 text-sm text-gray-400 flex justify-between">
        <span>Target</span>
        <span>{(100*Number(balances.mgpCurve)/Number(balances.mgpCurve+balances.rmgpCurve+balances.ymgpCurve)).toFixed(0)}%</span>
      </div>
      <AmountInput label="Supply rMGP" balance={balances.RMGP[0]} value={amounts.rmgpLP} onChange={amounts.setRMGPLP} token={{ symbol: 'rMGP', color: 'bg-green-400', bgColor: 'bg-green-600' }} placeholder={((): string => {
        const rmgpTarget = Number(balances.rmgpCurve) / Number(balances.mgpCurve + balances.rmgpCurve + balances.ymgpCurve)
        const totalRecommendedLP = amounts.mgpLP === 0n ? Number(amounts.ymgpLP) / (Number(balances.ymgpCurve) / Number(balances.mgpCurve + balances.ymgpCurve)) : (amounts.ymgpLP === 0n ? Number(amounts.mgpLP) / (Number(balances.mgpCurve) / Number(balances.mgpCurve + balances.ymgpCurve)) : Number(amounts.mgpLP + amounts.ymgpLP))
        return formatEther(BigInt(totalRecommendedLP * rmgpTarget / (1 - rmgpTarget))).toString()
      })()} />
      <div className="mb-4 text-sm text-gray-400 flex justify-between">
        <span>Target</span>
        <span>{(100*Number(balances.rmgpCurve)/Number(balances.mgpCurve+balances.rmgpCurve+balances.ymgpCurve)).toFixed(0)}%</span>
      </div>
      <AmountInput label="Supply yMGP" balance={balances.YMGP[0]} value={amounts.ymgpLP} onChange={amounts.setYMGPLP} token={{ symbol: 'yMGP', color: 'bg-green-400', bgColor: 'bg-green-600' }} placeholder={((): string => {
        const ymgpTarget = Number(balances.ymgpCurve) / Number(balances.mgpCurve + balances.rmgpCurve + balances.ymgpCurve)
        const totalRecommendedLP = amounts.mgpLP === 0n ? Number(amounts.rmgpLP) / (Number(balances.rmgpCurve) / Number(balances.mgpCurve + balances.rmgpCurve)) : (amounts.rmgpLP === 0n ? Number(amounts.mgpLP) / (Number(balances.mgpCurve) / Number(balances.mgpCurve + balances.rmgpCurve)) : Number(amounts.mgpLP + amounts.rmgpLP))
        return formatEther(BigInt(totalRecommendedLP * ymgpTarget / (1 - ymgpTarget))).toString()
      })()} />
      <div className="mb-4 text-sm text-gray-400 flex justify-between">
        <span>Target</span>
        <span>{(100*Number(balances.ymgpCurve)/Number(balances.mgpCurve+balances.rmgpCurve+balances.ymgpCurve)).toFixed(0)}%</span>
      </div>
      <button type="submit" className="w-full py-3 rounded-lg transition-colors bg-green-600 hover:bg-green-700}" onClick={actions.supplyLiquidity}>Get cMGP</button>
    </div>
    <InfoCard text='Supply liquidity to the cMGP Curve pool (MGP/rMGP/yMGP). You can supply liquidity at any ratio of MGP:rMGP:yMGP, however it is recommended you match the targets to prevent slippage. To stake or withdraw liquidity, use <a href="https://www.curve.finance/dex/arbitrum/pools/factory-stable-ng-179/withdraw/" className="text-blue-400">Curve</a>.' />
  </>
})
SupplyLiquidityPage.displayName = 'SupplyLiquidityPage'
