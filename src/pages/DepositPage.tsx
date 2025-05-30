import { memo, type ReactElement, useState } from 'react'
import { TokenApproval } from '../components/TokenApproval'
import { SwapInput } from '../components/SwapInput'
import { aprToApy, formatEther } from '../utils'
import { InfoCard } from '../components/InfoCard'
import { BuyOnCurve } from '../components/BuyOnCurve'
import { type Coins } from '../config/contracts'
import { useGlobalContext } from '../contexts/GlobalContext'

export const DepositPage = memo((): ReactElement => {
  const { actions, allowances, amounts, balances, exchangeRates, rewards } = useGlobalContext()
  const [selectedCoin, setSelectedCoin] = useState<Coins>('MGP')

  return <>
    <div className="rounded-lg mt-4">
      <SwapInput label="Get rMGP" selectedCoin={selectedCoin} onCoinChange={setSelectedCoin} balance={balances[selectedCoin][0]} value={amounts.send} onChange={amounts.setSend} outputCoin='RMGP' />
      {selectedCoin === 'MGP' ? <div className="grid grid-cols-2 gap-2">
        <div>
          <TokenApproval sendAmount={amounts.send} allowance={allowances[selectedCoin][0]} onApprove={actions.approve} tokenSymbol={selectedCoin} />
          <button type="submit" className="py-3 rounded-lg transition-colors bg-green-600 hover:bg-green-700 w-full" onClick={actions.depositMGP}>Mint ({formatEther(BigInt(exchangeRates.mintRMGP*Number(amounts.send)))} rMGP)</button>
        </div>
        <BuyOnCurve sendAmount={amounts.send} curveAmount={amounts.mgpRmgpCurve} allowanceCurve={allowances.curve[selectedCoin][0]} rate={exchangeRates.curve.mgpRMGP} onApprove={actions.approve} buy={actions.buyRMGP} tokenASymbol={selectedCoin} tokenBSymbol='rMGP' />
      </div> : <>
        <TokenApproval sendAmount={amounts.send} allowance={allowances.curve[selectedCoin][0]} onApprove={actions.approve} tokenSymbol={selectedCoin} />
        <button type="submit" className="py-3 rounded-lg transition-colors bg-green-600 hover:bg-green-700 w-full" onClick={actions.swapToMGP}>Swap to MGP</button>
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
    </div>
    <InfoCard text={selectedCoin === 'MGP' ? "MGP can be converted to rMGP to earn auto compounded yield. Yield is accrued from vlMGP SubDAO Rewards." : `${selectedCoin} will be swapped to MGP and then converted to rMGP to earn auto compounded yield. Other coins support coming soon.`} />
  </>
})
DepositPage.displayName = 'DepositPage'
