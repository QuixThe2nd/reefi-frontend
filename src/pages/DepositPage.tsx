import { memo, type ReactElement, useState, useRef, useEffect } from 'react'
import { formatEther } from '../utils';
import { TokenApproval } from '../components/TokenApproval';
import { aprToApy } from '../utils';
import { InfoCard } from '../components/InfoCard';
import { BuyOnCurve } from '../components/BuyOnCurve';
import { decimals, type Coins } from '../config/contracts';
import { useGlobalContext } from '../contexts/GlobalContext';

const coins: Record<Coins, { symbol: string; color: string; bgColor: string }> = {
  MGP: { symbol: 'MGP', color: 'bg-blue-400', bgColor: 'bg-blue-600' },
  RMGP: { symbol: 'RMGP', color: 'bg-green-400', bgColor: 'bg-green-600' },
  YMGP: { symbol: 'YMGP', color: 'bg-green-400', bgColor: 'bg-green-600' },
  CMGP: { symbol: 'CMGP', color: 'bg-indigo-400', bgColor: 'bg-indigo-600' },
  CKP: { symbol: 'CKP', color: 'bg-pink-400', bgColor: 'bg-pink-600' },
  PNP: { symbol: 'PNP', color: 'bg-orange-400', bgColor: 'bg-orange-600' },
  EGP: { symbol: 'EGP', color: 'bg-red-400', bgColor: 'bg-red-600' },
  LTP: { symbol: 'LTP', color: 'bg-teal-400', bgColor: 'bg-teal-600' },
  ETH: { symbol: 'ETH', color: 'bg-gray-400', bgColor: 'bg-gray-600' },
  BNB: { symbol: 'BNB', color: 'bg-yellow-400', bgColor: 'bg-yellow-600' }
} as const

export const DepositPage = memo((): ReactElement => {
  const { actions, allowances, amounts, balances, exchangeRates, prices, rewards } = useGlobalContext()

  const [selectedCoin, setSelectedCoin] = useState<Coins>('MGP')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsDropdownOpen(false)
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return (): void => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  

  const rMGPAmount = selectedCoin === 'MGP' ? formatEther(amounts.send) / exchangeRates.curve.mgpRMGP : (selectedCoin === 'YMGP' ? formatEther(amounts.send) / exchangeRates.curve.ymgpMGP : (formatEther(amounts.send) * prices[selectedCoin]) / (prices.MGP * exchangeRates.curve.mgpRMGP))

  return <>
    <div className="bg-gray-700/50 p-5 rounded-lg">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-md font-medium">Get rMGP</h3>
          <div className="text-sm text-gray-400">Balance: {formatEther(balances[selectedCoin][0], decimals[selectedCoin])} {selectedCoin}</div>
        </div>
        <div className="bg-gray-900 rounded-lg p-4 flex items-center justify-between">
          <input type="text" placeholder="0" className="bg-transparent outline-none text-xl w-3/4" value={amounts.send === 0n ? undefined : formatEther(amounts.send, decimals[selectedCoin])} onChange={e => amounts.setSend(BigInt(Math.round((Number.isNaN(Number.parseFloat(e.target.value)) ? 0 : Number.parseFloat(e.target.value)) * Number(10n ** BigInt(decimals[selectedCoin])))))} />
          <div className="flex items-center space-x-2">
            <button type="button" className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded" onClick={() => amounts.setSend(balances[selectedCoin][0])}>MAX</button>
            <div className="relative" ref={dropdownRef}>
              <button type="button" onClick={() => setIsDropdownOpen(!isDropdownOpen)} className={`rounded-md px-3 py-1 flex items-center cursor-pointer hover:opacity-90 transition-opacity ${coins[selectedCoin].bgColor}`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 ${coins[selectedCoin].color}`}>{selectedCoin[0]?.toUpperCase()}</div>
                <span className="mr-2">{selectedCoin}</span>
                <svg className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              {isDropdownOpen && <div className="absolute top-full mt-1 right-0 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 min-w-32">
                {(Object.keys(coins) as Coins[]).map(coin => coin === 'RMGP' || coin === 'CMGP' ? '' : <button key={coin} className={`w-full px-3 py-2 flex items-center hover:bg-gray-700 transition-colors first:rounded-t-lg last:rounded-b-lg ${selectedCoin === coin ? 'bg-gray-700' : ''}`} type="button" onClick={() => {
                  setSelectedCoin(coin)
                  setIsDropdownOpen(false)
                }}>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 ${coins[coin].color}`}>{coin[0]?.toUpperCase()}</div>
                  <span>{coin}</span>
                </button>)}
              </div>}
            </div>
          </div>
        </div>
        <div className="mt-2 text-sm text-gray-400 text-center">≈ {rMGPAmount.toFixed(6)} rMGP</div>
      </div>
      
      {selectedCoin === 'MGP' ? <div className="grid grid-cols-2 gap-2">
        <div>
          <TokenApproval sendAmount={amounts.send} allowance={allowances[selectedCoin][0]} onApprove={actions.approve} tokenSymbol={selectedCoin} />
          <button type="submit" className="py-3 rounded-lg transition-colors bg-green-600 hover:bg-green-700 w-full" onClick={actions.depositMGP}>Mint ({rMGPAmount.toFixed(6)} rMGP)</button>
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
    <InfoCard text={selectedCoin === 'MGP' ? "MGP can be converted to rMGP to earn auto compounded yield. Yield is accrued from vlMGP SubDAO Rewards and half the withdrawal fees." : `${selectedCoin} will be swapped to MGP and then converted to rMGP to earn auto compounded yield. Other coins support coming soon.`} />
  </>
})
DepositPage.displayName = 'DepositPage'