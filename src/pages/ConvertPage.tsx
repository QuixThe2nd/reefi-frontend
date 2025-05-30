import { memo, type ReactElement, useState } from 'react'
import { formatEther } from '../utils';
import { TokenApproval } from '../components/TokenApproval';
import { BuyOnCurve } from '../components/BuyOnCurve';
import { SwapInput } from '../components/SwapInput';
import { type Coins } from '../config/contracts';
import { useGlobalContext } from '../contexts/GlobalContext';
import { Page } from '../components/Page';

export const ConvertPage = memo((): ReactElement => {
  const { actions, allowances, amounts, balances } = useGlobalContext()
  const [selectedCoin, setSelectedCoin] = useState<Coins>('RMGP')

  return <Page info={selectedCoin === 'RMGP' ? "yMGP is backed 1:1 by rMGP. This process can not be undone. yMGP alone has no additional benefit over rMGP, it must be locked for boosted yield." : `${selectedCoin} will be swapped to MGP, then converted to rMGP, then converted to yMGP. Other coins support coming soon.`}>
    <SwapInput label="Get yMGP" selectedCoin={selectedCoin} onCoinChange={setSelectedCoin} balance={balances[selectedCoin][0]} value={amounts.send} onChange={amounts.setSend} outputCoin='YMGP' />
    {selectedCoin === 'MGP' || selectedCoin === 'RMGP' ? <div className={`${selectedCoin === 'RMGP' ? 'grid grid-cols-2' : ''} gap-2 mb-4`}>
      {selectedCoin === 'RMGP' && <div>
        <TokenApproval sendAmount={amounts.send} allowance={allowances.RMGP[0]} onApprove={actions.approve} tokenSymbol='RMGP' />
        <button type="submit" className="w-full py-2 rounded-lg transition-colors bg-green-600 hover:bg-green-700 h-min" onClick={actions.depositRMGP}>Mint ({formatEther(amounts.send)} yMGP)</button>
      </div>}
      <BuyOnCurve sendAmount={amounts.send} curveAmount={amounts.rmgpYmgpCurve} allowanceCurve={allowances.curve.RMGP[0]} nativeRate={1} onApprove={actions.approve} buy={actions.buyYMGP} tokenASymbol='RMGP' tokenBSymbol='yMGP' />
    </div> : <>
      <TokenApproval sendAmount={amounts.send} allowance={allowances.curve[selectedCoin][0]} onApprove={actions.approve} tokenSymbol={selectedCoin} />
      <button type="submit" className="py-2 rounded-lg transition-colors bg-green-600 hover:bg-green-700 h-min w-full" onClick={actions.swapToMGP}>Swap to MGP</button>
    </>}
  </Page>
})
ConvertPage.displayName = 'ConvertPage'
