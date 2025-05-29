import { memo, type ReactElement } from 'react'
import { YieldBadge } from './YieldBadge'
import { aprToApy } from '../utils'

interface Props {
  readonly mgpAPR: number,
  readonly cmgpAPY: number,
  readonly cmgpPoolAPY: number
  readonly reefiLockedMGP: bigint,
  readonly totalLockedYMGP: bigint
  readonly mgpCurveBalance: bigint
  readonly rmgpCurveBalance: bigint
  readonly ymgpCurveBalance: bigint
  readonly mintRMGPRate: number
}

export const YieldBadges = memo(({ mgpAPR, cmgpAPY, cmgpPoolAPY, reefiLockedMGP, totalLockedYMGP, mgpCurveBalance, rmgpCurveBalance, ymgpCurveBalance, mintRMGPRate }: Props): ReactElement => {
  return <div className="flex flex-row-reverse mb-6">
    <div className="flex gap-1">
      <YieldBadge asset="MGP" apr={mgpAPR} breakdown={[
        { asset: 'Original vlMGP', apr: mgpAPR }
       ]} />
      <YieldBadge asset="rMGP" apy={aprToApy(mgpAPR)*0.9} breakdown={[
        { asset: 'vlMGP', apy: aprToApy(mgpAPR)*0.9 }
       ]} />
      <YieldBadge asset="cMGP" apy={cmgpAPY} breakdown={[
        { asset: `${(100*Number(mgpCurveBalance)*mintRMGPRate/(Number(mgpCurveBalance)+(Number(rmgpCurveBalance)*mintRMGPRate)+(Number(ymgpCurveBalance)*mintRMGPRate))).toFixed(2)}% MGP`, apy: 0 },
        { asset: `${(100*Number(rmgpCurveBalance)*mintRMGPRate/(Number(mgpCurveBalance)+(Number(rmgpCurveBalance)*mintRMGPRate)+(Number(ymgpCurveBalance)*mintRMGPRate))).toFixed(2)}% rMGP`, apy: aprToApy(mgpAPR)*0.9 },
        { asset: `${(100*Number(ymgpCurveBalance)*mintRMGPRate/(Number(mgpCurveBalance)+(Number(rmgpCurveBalance)*mintRMGPRate)+(Number(ymgpCurveBalance)*mintRMGPRate))).toFixed(2)}% yMGP`, apy: aprToApy(mgpAPR)*0.9 },
        { asset: 'Swap Fees', apy: cmgpPoolAPY }
        ]} />
      <YieldBadge asset="Locked yMGP" apy={((Number(reefiLockedMGP)*aprToApy(mgpAPR)*0.05)/Number(totalLockedYMGP))+aprToApy(mgpAPR)*0.9} suffix='+' breakdown={[
        { asset: 'Base vlMGP', apy: aprToApy(mgpAPR)*0.9 },
        { asset: 'Boosted vlMGP', apr: ((Number(reefiLockedMGP)*mgpAPR*0.05)/Number(totalLockedYMGP)) },
        { asset: 'Withdrawals', apr: 'variable' }
      ]} />
    </div>
  </div>
})
YieldBadges.displayName = 'YieldBadges'
