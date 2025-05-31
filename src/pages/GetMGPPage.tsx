import { memo, type ReactElement } from 'react'
import { useGlobalContext } from '../contexts/GlobalContext'
import { Page } from '../components/Page'
import { SwapToken } from '../components/SwapToken'

export const GetMGPPage = memo((): ReactElement => {
  const { actions, amounts, rewards } = useGlobalContext()
  return <Page info="MGP is Magpie's governance token. All Reefi derivatives are built around MGP.">
    <SwapToken originalTokenIn='WETH' tokenOut="MGP" nativeRate={0} curveAmount={amounts.mgpRmgpCurve} buy={actions.buyRMGP} />
    <div className="mt-4 text-sm text-gray-400">
      <div className="flex justify-between mb-1">
        <span>Original APR</span>
        <span>0%</span>
      </div>
      <div className="flex justify-between mb-1">
        <span>Locked APR</span>
        <span>{Math.round(10_000*rewards.mgpAPR)/100}%</span>
      </div>
    </div>
  </Page>
})
GetMGPPage.displayName = 'GetMGPPage'
