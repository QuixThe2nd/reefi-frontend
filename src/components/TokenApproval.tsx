import { memo, useState, type ReactElement } from "react";

import { Button } from "./Button";

interface TokenApprovalProperties {
  readonly allowance: bigint;
  readonly send: bigint;
  readonly onApprove: (_infinity: boolean) => void;
  readonly tokenSymbol: string;
  readonly curve?: boolean;
  readonly className?: string;
}

export const TokenApproval = memo(({ allowance, send, onApprove, tokenSymbol, curve = false, className = "w-full" }: TokenApprovalProperties): ReactElement | undefined => {
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

  if (allowance >= send) return;

  return <div className={className}>
    <div className="flex items-center">
      <input checked={approveInfinity} className="mr-2" id={`approve-infinity-${tokenSymbol}`} onChange={() => {
        setApproveInfinity(v => !v);
      }} type="checkbox" />
      <label className="cursor-pointer select-none text-sm text-gray-300" htmlFor={`approve-infinity-${tokenSymbol}`}>Approve Infinity</label>
    </div>
    <Button className="w-full my-2" disabled={isApproving} onClick={handleApprove} type="submit">{getButtonText()}</Button>
  </div>;
});
TokenApproval.displayName = "TokenApproval";
