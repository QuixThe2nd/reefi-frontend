import { memo, type ReactElement } from 'react'
import { aprToApy } from '../utils'
import { useGlobalContext } from '../contexts/GlobalContext'
import { Page } from '../components/Page'
import { SwapToken } from '../components/SwapToken'

export const DepositPage = memo((): ReactElement => {
  const { actions, amounts, rewards } = useGlobalContext()
  return <Page info="MGP can be converted to rMGP to earn auto compounded yield. Yield is accrued from vlMGP SubDAO Rewards.">
    <SwapToken originalTokenIn="MGP" tokenOut="rMGP" curveAmount={amounts.mgpRmgpCurve} buy={actions.buyRMGP} label="Mint" nativeSwap={actions.depositMGP} excludeCoins={['CKP', 'PNP', 'EGP', 'LTP', 'WETH']} />
    <div className="mt-4 text-sm text-gray-400">
      <div className="flex justify-between mb-1">
        <span>Original APR</span>
        <span>{Math.round(10_000*rewards.mgpAPR)/100}%</span>
      </div>
      <div className="flex justify-between mb-1">
        <span>Reward APY</span>
        <span>{Math.round(10_000*aprToApy(rewards.mgpAPR)*0.9)/100}%</span>
      </div>
    </div>
  </Page>
})
DepositPage.displayName = 'DepositPage'
