import { memo, type ReactElement, useState, useRef, useEffect } from 'react'
import { formatEther } from '../utils'
import { coins, decimals, type Coins } from '../config/contracts'
import { useGlobalContext } from '../contexts/GlobalContext'

interface Props {
  readonly label: string
  readonly selectedCoin: Coins | 'ETH'
  readonly onCoinChange: (_coin: Coins | 'ETH') => void
  readonly balance: bigint
  readonly value: bigint
  readonly onChange: (_value: bigint) => void
  readonly outputCoin: Coins
  readonly excludeCoins: Coins[]
}

export const SwapInput = memo(({ label, selectedCoin, onCoinChange, balance, value, onChange, outputCoin, excludeCoins }: Props): ReactElement => {
  const { exchangeRates, prices } = useGlobalContext()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  excludeCoins = [ outputCoin, 'cMGP', ...excludeCoins ]
  const availableCoins = (Object.keys(coins) as Coins[]).filter(coin => !excludeCoins.includes(coin))
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsDropdownOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return (): void => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const estimatedOutput = (): string | undefined => {
    if (value === 0n) return undefined
    const inputAmount = formatEther(value, decimals[selectedCoin])
    if (selectedCoin === 'rMGP' && outputCoin === 'yMGP') return undefined
    if (selectedCoin === 'MGP' && outputCoin === 'rMGP') return undefined
    if (selectedCoin === 'yMGP' && outputCoin === 'rMGP') return undefined
    else if (selectedCoin === 'yMGP' && outputCoin === 'MGP') return (inputAmount / exchangeRates.curve.ymgpMGP).toFixed(6) + ' ' + outputCoin
    else if (outputCoin === 'rMGP') return (((inputAmount * prices[selectedCoin === 'ETH' ? `W${selectedCoin}` as 'WETH' : selectedCoin]) / prices.MGP) / exchangeRates.curve.mgpRMGP).toFixed(6) + ' ' + outputCoin
    else return undefined
  }

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <h3 className="text-md font-medium">{label}</h3>
        <div className="text-sm text-gray-400">Balance: {formatEther(balance, decimals[selectedCoin]).toFixed(4)} {selectedCoin}</div>
      </div>
      <div className="bg-gray-900 rounded-lg p-4 flex items-center justify-between">
        <input type="text" placeholder='0' className="bg-transparent outline-none text-xl w-3/4" value={value === 0n ? undefined : formatEther(value, decimals[selectedCoin])} onChange={e => onChange(BigInt(Math.round((Number.isNaN(Number.parseFloat(e.target.value)) ? 0 : Number.parseFloat(e.target.value)) * Number(10n ** BigInt(decimals[selectedCoin])))))} />
        <div className="flex items-center space-x-2">
          <button type="button" className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded" onClick={() => onChange(balance)}>MAX</button>
          <div className="relative" ref={dropdownRef}>
            <button type="button" onClick={() => setIsDropdownOpen(!isDropdownOpen)} className={`rounded-md px-3 py-1 flex items-center cursor-pointer hover:opacity-90 transition-opacity ${coins[selectedCoin === 'ETH' ? `W${selectedCoin}` as 'WETH' : selectedCoin].bgColor}`}>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 ${coins[selectedCoin === 'ETH' ? `W${selectedCoin}` as 'WETH' : selectedCoin].color}`}>{selectedCoin[0]?.toUpperCase()}</div>
              <span className="mr-2">{selectedCoin}</span>
              <svg className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {isDropdownOpen && <div className="absolute top-full mt-1 right-0 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 min-w-32">
              {availableCoins.map(coin => <>
                <button key={coin} className={`w-full px-3 py-2 flex items-center hover:bg-gray-700 transition-colors first:rounded-t-lg last:rounded-b-lg ${selectedCoin === coin ? 'bg-gray-700' : ''}`} type="button" onClick={() => {
                  onCoinChange(coin)
                  setIsDropdownOpen(false)
                }}>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 ${coins[coin].color}`}>{coin[0]?.toUpperCase()}</div>
                  <span>{coin}</span>
                </button>
                {(coin === 'WETH') && <button key={coin} className={`w-full px-3 py-2 flex items-center hover:bg-gray-700 transition-colors first:rounded-t-lg last:rounded-b-lg ${selectedCoin === coin.replace('W', '') ? 'bg-gray-700' : ''}`} type="button" onClick={() => {
                  onCoinChange(coin.replace('W', '') as 'ETH')
                  setIsDropdownOpen(false)
                }}>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 ${coins[coin].color}`}>{coin[1]?.toUpperCase()}</div>
                  <span>{coin.replace('W', '')}</span>
                </button>}
              </>)}
            </div>}
          </div>
        </div>
      </div>
      {estimatedOutput() !== undefined && <div className="mt-2 text-sm text-gray-400 text-center">≈{estimatedOutput()}</div>}
    </div>
  )
})

SwapInput.displayName = 'SwapInput'