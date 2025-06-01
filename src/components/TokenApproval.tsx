import { memo, useState, type ReactElement } from "react";

interface TokenApprovalProperties {
  readonly allowance: bigint;
  readonly sendAmount: bigint;
  readonly onApprove: (_infinity: boolean) => void;
  readonly tokenSymbol: string;
  readonly curve?: boolean;
  readonly className?: string;
}

export const TokenApproval = memo(({ allowance, sendAmount, onApprove, tokenSymbol, curve = false, className = "w-full" }: TokenApprovalProperties): ReactElement | undefined => {
  const [approveInfinity, setApproveInfinity] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const handleApprove = (): void => {
    setIsApproving(true);
    onApprove(approveInfinity);
  };
  const getButtonText = (): string => {
    if (isApproving) return "Approving...";
    const curveText = curve ? " on Curve" : "";
    return `Approve ${tokenSymbol}${curveText}`;
  };

  if (allowance >= sendAmount) return;

  return <div className={className}>
    <div className="flex items-center">
      <input checked={approveInfinity} className="mr-2" id={`approve-infinity-${tokenSymbol}`} onChange={() => setApproveInfinity(v => !v)} type="checkbox" />
      <label className="cursor-pointer select-none text-sm text-gray-300" htmlFor={`approve-infinity-${tokenSymbol}`}>Approve Infinity</label>
    </div>
    <button className="my-2 h-min w-full rounded-lg bg-green-600 py-2 text-xs transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50 md:text-base" disabled={isApproving} onClick={handleApprove} type="submit">{getButtonText()}</button>
  </div>;
});
TokenApproval.displayName = "TokenApproval";
