import { ReactElement, memo } from 'react'
import { formatEther, parseEther } from '../utils'

interface AmountInputProps {
  readonly label: string
  readonly balance: bigint
  readonly value: bigint
  readonly onChange: (_value: bigint) => void
  readonly token: {
    readonly symbol: string
    readonly color: string
    readonly bgColor: string
  },
  readonly placeholder?: string
}

export const AmountInput = memo(({ label, balance, value, onChange, token, placeholder }: AmountInputProps): ReactElement => {
  return <div className="mb-4">
    <div className="flex justify-between items-center mb-1">
      <h3 className="text-md font-medium">{label}</h3>
      <div className="text-sm text-gray-400">Balance: {formatEther(balance, 18)} {token.symbol}</div>
    </div>
    <div className="bg-gray-900 rounded-lg p-4 flex items-center justify-between">
      <input type="text" placeholder={placeholder ?? '0'} className="bg-transparent outline-none text-xl w-3/4" value={value === 0n ? undefined : formatEther(value)} onChange={e => onChange(parseEther(Number.isNaN(Number.parseFloat(e.target.value)) ? 0 : Number.parseFloat(e.target.value)))} />
      <div className="flex items-center space-x-2">
        <button type="button" className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded" onClick={() => onChange(balance)}>MAX</button>
        <div className={`rounded-md px-3 py-1 flex items-center ${token.bgColor}`}>
          <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 ${token.color}`}>{token.symbol[0]?.toUpperCase()}</div>
          <span>{token.symbol}</span>
        </div>
      </div>
    </div>
  </div>
})
AmountInput.displayName = 'AmountInput';
