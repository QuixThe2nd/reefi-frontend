import { decimals } from "../config/contracts";
import { formatEther, formatNumber } from "../utilities";
import { memo, type ReactElement } from "react";
import { useWriteContract, type UseWriteContractReturnType } from "wagmi";

import { Button } from "../components/Button";
import { Page } from "../components/Page";

import type { wagmiConfig } from "..";

interface Properties {
  readonly claimVMGPRewards: (_writeContract: UseWriteContractReturnType<typeof wagmiConfig>["writeContract"]) => void;
  readonly unclaimedUserVMGPYield: bigint;
  readonly vmgpHoldings: bigint;
}

export const ClaimVMGPYield = memo(({ claimVMGPRewards, unclaimedUserVMGPYield, vmgpHoldings }: Properties): ReactElement => {
  const { writeContract, isPending } = useWriteContract();
  return <Page info={<span>Locked vMGP is unable to vote on proposals but instead earns yield by selling it&apos;s vote power.</span>} noTopMargin>
    <h3 className="mt-2 mb-1 text-base font-medium">Unclaimed Rewards</h3>
    <div className="flex justify-between rounded-lg bg-gray-700/50 p-4">
      <div className="flex flex-col">
        <p className="text-lg font-medium">You: {formatNumber(formatEther(unclaimedUserVMGPYield, decimals.yMGP), 4)} yMGP</p>
      </div>
      <div className="flex flex-col text-right">
        <p className="text-lg font-medium">Total: {formatNumber(formatEther(vmgpHoldings, decimals.yMGP), 4)} yMGP</p>
      </div>
    </div>
    <Button className="mt-4 w-full" isLoading={isPending} onClick={() => claimVMGPRewards(writeContract)} type="button">Claim Rewards</Button>
  </Page>;
});
ClaimVMGPYield.displayName = "ClaimVMGPYield";
