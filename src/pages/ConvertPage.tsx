import { memo, type ReactElement } from 'react'
import { useGlobalContext } from '../contexts/GlobalContext';
import { Page } from '../components/Page';
import { SwapToken } from '../components/SwapToken';

export const ConvertPage = memo((): ReactElement => {
  const { actions, amounts } = useGlobalContext()

  return <Page info="yMGP is backed 1:1 by rMGP. This process can not be undone. yMGP alone has no additional benefit over rMGP, it must be locked for boosted yield.">
    <SwapToken originalTokenIn="rMGP" tokenOut="yMGP" nativeRate={1} curveAmount={amounts.rmgpYmgpCurve} buy={actions.buyYMGP} nativeSwap={actions.depositRMGP} label="Mint" />
  </Page>
})
ConvertPage.displayName = 'ConvertPage'
