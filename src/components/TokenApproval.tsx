import { ReactElement, useState } from 'react'

interface TokenApprovalProps {
  allowance: bigint | undefined
  sendAmount: bigint
  onApprove: (infinity: boolean, curve: boolean) => Promise<void>
  tokenSymbol: string
  curve?: boolean
  className?: string
}

export const TokenApproval = ({ allowance, sendAmount, onApprove, tokenSymbol, curve = false, className = "w-full" }: TokenApprovalProps): ReactElement | null => {
  const [approveInfinity, setApproveInfinity] = useState(false)
  const [isApproving, setIsApproving] = useState(false)

  const handleApprove = async (): Promise<void> => {
    setIsApproving(true)
    try {
      await onApprove(approveInfinity, curve)
    } finally {
      setIsApproving(false)
    }
  }

  if (allowance === undefined) return <p>Loading...</p>
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