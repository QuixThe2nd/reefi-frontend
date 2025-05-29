import { memo, type ReactElement } from 'react'
import { formatEther } from '../utils';
import { AmountInput } from '../components/AmountInput';
import { TokenApproval } from '../components/TokenApproval';
import { InfoCard } from '../components/InfoCard';
import { BuyOnCurve } from '../components/BuyOnCurve';
import { useGlobalContext } from '../contexts/GlobalContext';

export const ConvertPage = memo((): ReactElement => {
  const { actions, allowances, amounts, balances } = useGlobalContext()
  return <>
    <div className="bg-gray-700/50 p-5 rounded-lg">
      <AmountInput label="Convert rMGP" token={{ symbol: 'rMGP', color: 'bg-green-400', bgColor: 'bg-green-600' }} balance={balances.RMGP[0]} value={amounts.send} onChange={amounts.setSend} />
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div>
          <TokenApproval sendAmount={amounts.send} allowance={allowances.RMGP[0]} onApprove={actions.approve} tokenSymbol='rMGP' />
          <button type="submit" className="w-full py-3 rounded-lg transition-colors bg-green-600 hover:bg-green-700" onClick={actions.depositRMGP}>Mint ({formatEther(amounts.send)} yMGP)</button>
        </div>
        <BuyOnCurve sendAmount={amounts.send} curveAmount={amounts.rmgpYmgpCurve} allowanceCurve={allowances.curve.RMGP[0]} rate={1} onApprove={actions.approve} buy={actions.buyYMGP} tokenASymbol='rMGP' tokenBSymbol='yMGP' />
      </div>
    </div>
    <InfoCard text="yMGP is backed 1:1 by rMGP. This process can not be undone. yMGP alone has no additional benefit over rMGP, it must be locked for boosted yield." />
  </>
})
ConvertPage.displayName = 'ConvertPage'
