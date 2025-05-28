import { ReactElement, useState } from 'react'

interface TokenApprovalProps {
  readonly allowance: bigint
  readonly sendAmount: bigint
  readonly onApprove: (_infinity: boolean, _curve: boolean) => Promise<void>
  readonly tokenSymbol: string
  readonly curve?: boolean
  readonly className?: string
}

export const TokenApproval = ({ allowance, sendAmount, onApprove, tokenSymbol, curve = false, className = "w-full" }: TokenApprovalProps): ReactElement | null => {
  const [approveInfinity, setApproveInfinity] = useState(false)
  const [isApproving, setIsApproving] = useState(false)

  const handleApprove = (): void => {
    setIsApproving(true)
    onApprove(approveInfinity, curve).then(() => setIsApproving(false)).catch(() => setIsApproving(false))
  }

  if (allowance >= sendAmount) return null

  return (
    <div className={className}>
      <div className="flex items-center mt-2">
        <input id={`approve-infinity-${tokenSymbol}`} type="checkbox" className="mr-2" checked={approveInfinity} onChange={() => setApproveInfinity(v => !v)} />
        <label htmlFor={`approve-infinity-${tokenSymbol}`} className="text-sm text-gray-300 select-none cursor-pointer">Approve Infinity</label>
      </div>
      <button type="submit" className="w-full py-3 rounded-lg transition-colors bg-green-600 hover:bg-green-700 mt-2 disabled:opacity-50 disabled:cursor-not-allowed mb-2" onClick={handleApprove} disabled={isApproving}>
        {isApproving ? 'Approving...' : `Approve ${tokenSymbol}${curve ? ` on Curve` : ''}`}
      </button>
    </div>
  )
}