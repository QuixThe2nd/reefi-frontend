import type { ReactElement } from 'react'
import { YieldBadge } from './YieldBadge'
import { aprToApy } from '../utils'

export const YieldBadges = ({ mgpAPR, cmgpAPY, reefiLockedMGP, totalLockedYMGP }: { mgpAPR: number, cmgpAPY: number, reefiLockedMGP: bigint | undefined, totalLockedYMGP: bigint | undefined }): ReactElement => {
  return <div className="flex flex-row-reverse mb-6">
    <div className="flex gap-1">
      <YieldBadge asset="MGP" apr={mgpAPR} />
      <YieldBadge asset="rMGP" apy={aprToApy(mgpAPR)*0.9} />
      <YieldBadge asset="cMGP" apy={cmgpAPY} />
      <YieldBadge asset="Locked yMGP" apy={((Number(reefiLockedMGP)*aprToApy(mgpAPR)*0.05)/Number(totalLockedYMGP))+(aprToApy(mgpAPR)*0.9)} suffix='+' />
    </div>
  </div>
}
