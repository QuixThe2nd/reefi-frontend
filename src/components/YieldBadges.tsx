import { memo, type ReactElement } from 'react'
import { YieldBadge } from './YieldBadge'
import { aprToApy } from '../utils'
import { useGlobalContext } from '../contexts/GlobalContext'

export const YieldBadges = memo((): ReactElement => {
  const { rewards, balances, exchangeRates, locked } = useGlobalContext()
  return <div className="flex flex-row-reverse mb-6">
    <div className="flex gap-1">
      <YieldBadge asset="MGP" apr={rewards.mgpAPR} breakdown={[
        { asset: 'Original vlMGP', apr: rewards.mgpAPR }
       ]} />
      <YieldBadge asset="rMGP" apy={aprToApy(rewards.mgpAPR)*0.9} breakdown={[
        { asset: 'vlMGP', apy: aprToApy(rewards.mgpAPR)*0.9 }
       ]} />
      <YieldBadge asset="cMGP" apy={rewards.cmgpAPY} breakdown={[
        { asset: `${(100*Number(balances.mgpCurve)*exchangeRates.mintRMGP/(Number(balances.mgpCurve)+(Number(balances.rmgpCurve)*exchangeRates.mintRMGP)+(Number(balances.ymgpCurve)*exchangeRates.mintRMGP))).toFixed(2)}% MGP`, apy: 0 },
        { asset: `${(100*Number(balances.rmgpCurve)*exchangeRates.mintRMGP/(Number(balances.mgpCurve)+(Number(balances.rmgpCurve)*exchangeRates.mintRMGP)+(Number(balances.ymgpCurve)*exchangeRates.mintRMGP))).toFixed(2)}% rMGP`, apy: aprToApy(rewards.mgpAPR)*0.9 },
        { asset: `${(100*Number(balances.ymgpCurve)*exchangeRates.mintRMGP/(Number(balances.mgpCurve)+(Number(balances.rmgpCurve)*exchangeRates.mintRMGP)+(Number(balances.ymgpCurve)*exchangeRates.mintRMGP))).toFixed(2)}% yMGP`, apy: aprToApy(rewards.mgpAPR)*0.9 },
        { asset: 'Swap Fees', apy: rewards.cmgpPoolAPY }
        ]} />
      <YieldBadge asset="Locked yMGP" apy={((Number(locked.reefiMGP)*aprToApy(rewards.mgpAPR)*0.05)/Number(locked.ymgp))+aprToApy(rewards.mgpAPR)*0.9} suffix='+' breakdown={[
        { asset: 'Base vlMGP', apy: aprToApy(rewards.mgpAPR)*0.9 },
        { asset: 'Boosted vlMGP', apr: ((Number(locked.reefiMGP)*rewards.mgpAPR*0.05)/Number(locked.ymgp)) },
        { asset: 'Withdrawals', apr: 'variable' }
      ]} />
    </div>
  </div>
})
YieldBadges.displayName = 'YieldBadges'
