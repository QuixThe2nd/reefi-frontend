import { memo, type ReactElement, useState } from 'react'
import { TokenApproval } from '../components/TokenApproval'
import { SwapInput } from '../components/SwapInput'
import { aprToApy, formatEther } from '../utils'
import { BuyOnCurve } from '../components/BuyOnCurve'
import { type Coins } from '../config/contracts'
import { useGlobalContext } from '../contexts/GlobalContext'
import { Page } from '../components/Page'

export const DepositPage = memo((): ReactElement => {
  const { actions, allowances, amounts, balances, exchangeRates, rewards } = useGlobalContext()
  const [selectedCoin, setSelectedCoin] = useState<Coins>('MGP')

  return <Page info={selectedCoin === 'MGP' ? "MGP can be converted to rMGP to earn auto compounded yield. Yield is accrued from vlMGP SubDAO Rewards." : `${selectedCoin} will be swapped to MGP and then converted to rMGP to earn auto compounded yield. Other coins support coming soon.`}>
    <SwapInput label="Get rMGP" selectedCoin={selectedCoin} onCoinChange={setSelectedCoin} balance={balances[selectedCoin][0]} value={amounts.send} onChange={amounts.setSend} outputCoin='RMGP' />
    {selectedCoin === 'MGP' ? <div className="grid grid-cols-2 gap-2">
      <div>
        <TokenApproval sendAmount={amounts.send} allowance={allowances[selectedCoin][0]} onApprove={actions.approve} tokenSymbol={selectedCoin} />
        <button type="submit" className="py-2 rounded-lg transition-colors bg-green-600 hover:bg-green-700 h-min w-full" onClick={actions.depositMGP}>Mint ({formatEther(BigInt(Number(amounts.send)/exchangeRates.mintRMGP)).toFixed(4)} rMGP)</button>
      </div>
      <BuyOnCurve sendAmount={amounts.send} curveAmount={amounts.mgpRmgpCurve} allowanceCurve={allowances.curve[selectedCoin][0]} rate={1/exchangeRates.curve.mgpRMGP} onApprove={actions.approve} buy={actions.buyRMGP} tokenASymbol={selectedCoin} tokenBSymbol='rMGP' />
    </div> : <>
      <TokenApproval sendAmount={amounts.send} allowance={allowances.curve[selectedCoin][0]} onApprove={actions.approve} tokenSymbol={selectedCoin} />
      <button type="submit" className="py-2 rounded-lg transition-colors bg-green-600 hover:bg-green-700 h-min w-full" onClick={actions.swapToMGP}>Swap to MGP</button>
    </>}
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
