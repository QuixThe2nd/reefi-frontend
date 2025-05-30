import { type ReactElement, memo, useState } from 'react'

interface TokenApprovalProps {
  readonly allowance: bigint
  readonly sendAmount: bigint
  readonly onApprove: (_infinity: boolean, _curve: boolean) => void
  readonly tokenSymbol: string
  readonly curve?: boolean
  readonly className?: string
}

export const TokenApproval = memo(({ allowance, sendAmount, onApprove, tokenSymbol, curve = false, className = "w-full" }: TokenApprovalProps): ReactElement | undefined => {
  const [approveInfinity, setApproveInfinity] = useState(false)
  const [isApproving, setIsApproving] = useState(false)

  const handleApprove = (): void => {
    setIsApproving(true)
    onApprove(approveInfinity, curve)
  }

  if (allowance >= sendAmount) return

  return <div className={className}>
    <div className="flex items-center">
      <input id={`approve-infinity-${tokenSymbol}`} type="checkbox" className="mr-2" checked={approveInfinity} onChange={() => setApproveInfinity(v => !v)} />
      <label htmlFor={`approve-infinity-${tokenSymbol}`} className="text-sm text-gray-300 select-none cursor-pointer">Approve Infinity</label>
    </div>
    <button type="submit" className="w-full py-2 rounded-lg transition-colors bg-green-600 hover:bg-green-700 h-min mt-2 disabled:opacity-50 disabled:cursor-not-allowed mb-2" onClick={handleApprove} disabled={isApproving}>{isApproving ? 'Approving...' : `Approve ${tokenSymbol}${curve ? ` on Curve` : ''}`}</button>
  </div>
})
TokenApproval.displayName = 'TokenApproval'
